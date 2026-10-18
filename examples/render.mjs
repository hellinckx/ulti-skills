import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const require=createRequire(import.meta.url);
const load=name=>process.env.ULTI_SKILLS_RENDER_NODE_MODULES ? require(path.join(process.env.ULTI_SKILLS_RENDER_NODE_MODULES,name)) : require(name);
const {chromium}=load('playwright');
const sharp=load('sharp');
const here=path.dirname(fileURLToPath(import.meta.url)), root=path.dirname(here);
const output=path.join(root,'.github','examples');
await mkdir(output,{recursive:true});
await mkdir(path.join(here,'generated'),{recursive:true});
const palette=JSON.parse(execFileSync(process.execPath,[path.join(root,'skills/color-system/scripts/palette.mjs'),'--hue','155','--json'],{encoding:'utf8'}));
assert.equal(palette.pairs.length,42);
assert.ok(palette.pairs.every(pair=>pair.pass));
await writeFile(path.join(here,'generated/palette.json'),JSON.stringify(palette,null,2)+'\n');

// Only these public demo files are served, on loopback, for the duration of rendering.
const allowed=new Map(['interface.html','landing.html','palette.html','motion.html','generated/palette.json'].map(name=>['/'+name,path.join(here,name)]));
const server=createServer(async(req,res)=>{
  const file=allowed.get(req.url);
  if(!file){res.writeHead(404);res.end();return}
  try{res.setHeader('Content-Type',file.endsWith('.json')?'application/json':'text/html; charset=utf-8');res.end(await readFile(file))}
  catch{res.writeHead(500);res.end('Demo file could not be read.')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
let browser;
const evidence={fixtureData:true,paletteSeed:155,contrastPairs:42,contrastPairsPassing:42,viewports:[],checks:[]};
try{
  browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
  const context=await browser.newContext({viewport:{width:1360,height:900},deviceScaleFactor:1,locale:'en-GB',reducedMotion:'reduce'});
  await context.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const open=async(file,width=1360,height=900)=>{await page.setViewportSize({width,height});await page.goto(origin+'/'+file);await page.evaluate(()=>document.fonts.ready);};
  const capture=async(file,name,width=1360,height=900)=>{
    await open(file,width,height);
    if(file==='palette.html')await page.waitForSelector('body[data-ready=true]');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' has horizontal overflow');
    await page.screenshot({path:path.join(output,name),animations:'disabled'});
  };
  await capture('interface.html','interface.png');
  await capture('landing.html','web-design.png');
  await capture('palette.html','color-system.png');
  await capture('motion.html','motion-states.png');

  await open('interface.html');
  await page.getByRole('button',{name:'+ New task'}).focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('dialog[open]');
  assert.equal(await page.locator('#task-name').evaluate(e=>e===document.activeElement),true);
  await page.getByRole('button',{name:'Add task',exact:true}).click();
  assert.equal(await page.locator('#task-name').getAttribute('aria-invalid'),'true');
  assert.equal(await page.locator('#task-error').isVisible(),true);
  assert.equal(await page.locator('#task-name').evaluate(e=>e===document.activeElement),true);
  await page.screenshot({path:path.join(output,'form-recovery.png'),animations:'disabled'});
  await page.locator('#task-name').fill('Document the restore path');
  await page.locator('#priority').selectOption({label:'High'});
  await page.getByRole('button',{name:'Add task',exact:true}).click();
  assert.equal(await page.locator('.task').count(),5);
  assert.ok((await page.locator('.task').last().innerText()).includes('High priority'));
  assert.equal(await page.locator('dialog').isVisible(),false);
  assert.equal(await page.getByRole('status').isVisible(),true);
  await page.getByRole('button',{name:'In review',exact:true}).click();
  assert.equal(await page.locator('.task:visible').count(),2);
  await page.getByRole('button',{name:'All work',exact:true}).click();
  assert.equal(await page.locator('.task:visible').count(),5);
  await page.locator('#new-task').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').isVisible(),false);
  assert.equal(await page.locator('#new-task').evaluate(e=>e===document.activeElement),true);
  evidence.checks.push('Keyboard opens dialog and focuses its first field','Empty submission shows associated error and preserves focus','Valid submission adds one task with its selected priority and confirms it','Review filter shows two matching rows','Escape closes dialog and restores trigger focus');

  for(const [name,width,height] of [['mobile',390,844],['tablet',820,1180],['normal',1360,900],['large',1920,1080]]){
    await capture('interface.html','responsive-'+name+'.png',width,height);
    assert.equal(await page.locator('#new-task').isVisible(),true);
    await page.locator('#new-task').click();
    assert.ok(await page.locator('#task-dialog').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}),'Dialog exceeds viewport: '+name);
    await page.keyboard.press('Escape');
    evidence.viewports.push({class:name,width,height,horizontalOverflow:false,dialogWithinViewport:true,file:'responsive-'+name+'.png'});
  }
  for(const file of ['landing.html','palette.html','motion.html']){
    await open(file,390,844);if(file==='palette.html')await page.waitForSelector('body[data-ready=true]');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' has mobile horizontal overflow');
  }
  assert.deepEqual(errors,[]);
  evidence.checks.push('No browser JavaScript errors','All four demo pages fit a 390px viewport');
  await context.close();

  const columns=[{key:'mobile',width:280,label:'MOBILE / 390 × 844'},{key:'tablet',width:370,label:'TABLET / 820 × 1180'},{key:'normal',width:520,label:'NORMAL / 1360 × 900'},{key:'large',width:630,label:'LARGE / 1920 × 1080'}];
  const layers=[];let x=35;
  const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
  const text=(label,w,h,size=14)=>Buffer.from(`<svg width="${w}" height="${h}"><text x="0" y="${size+4}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" fill="#526355">${esc(label)}</text></svg>`);
  layers.push({input:text('ONE INTERFACE / FOUR REAL BROWSER VIEWPORTS',1850,60,24),left:35,top:32});
  layers.push({input:text('Fictional data. Each capture uses the actual CSS viewport shown below.',1850,35,15),left:35,top:81});
  for(const col of columns){
    const input=await sharp(path.join(output,'responsive-'+col.key+'.png')).resize({width:col.width}).png().toBuffer();
    layers.push({input:text(col.label,col.width,40,12),left:x,top:139});
    layers.push({input,left:x,top:186});x+=col.width+20;
  }
  layers.push({input:text('Viewport screenshots are resized for this overview. Full-size PNGs and the HTML fixture are included.',1850,35,14),left:35,top:890});
  await sharp({create:{width:1930,height:955,channels:3,background:'#e8ece4'}}).composite(layers).png().toFile(path.join(output,'responsive.png'));
  await writeFile(path.join(output,'capture-info.json'),JSON.stringify(evidence,null,2)+'\n');
  console.log('EXAMPLES_RENDERED: 10 PNGs; 4 viewport checks; 7 browser checks; 42/42 palette pairs');
}finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
