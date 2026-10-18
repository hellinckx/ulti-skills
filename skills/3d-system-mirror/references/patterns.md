# Core patterns

Minimal, self-contained TypeScript for three.js (0.18x) with @react-three/fiber 9 and @react-three/drei 10. Adapt
names and data types to the project; keep the ideas.

## 1. Character bodies from a profile

One profile function per shape drives both the lathe geometry and the face placement, so the eyes always sit on the
surface. Cache one geometry per shape and scale it per character.

```ts
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

type Shape = "round" | "tall" | "wide" | "drop" | "egg" | "pear" | "cube" | "mushroom" | "peanut" | "gumdrop";

/** Radius (0..0.5) at height t (0 bottom … 1 top). */
export function profile(shape: Shape, t: number): number {
  const ellipse = (p: number) => 0.5 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * t - 1), p)), 1 / p);
  switch (shape) {
    case "tall": return ellipse(3.2);
    case "wide": return ellipse(2.6);
    case "drop": return ellipse(2) * (1 - 0.55 * Math.pow(t, 2.2));
    case "egg": return ellipse(2) * (1.08 - 0.24 * t);
    case "pear": return Math.min(0.5, ellipse(2) * (1.18 - 0.62 * t) + 0.07 * Math.exp(-(((t - 0.78) / 0.1) ** 2)));
    case "peanut": return ellipse(2.4) * (1 - 0.3 * Math.exp(-(((t - 0.47) / 0.11) ** 2)));
    case "gumdrop": return 0.5 * Math.pow(Math.max(0, 1 - Math.pow(t, 2.4)), 0.55);
    case "mushroom": return t < 0.56 ? 0.3 : 0.5 * Math.sqrt(Math.max(0, 1 - ((t - 0.56) / 0.44) ** 2));
    default: return ellipse(2.3);
  }
}

const cache = new Map<Shape, THREE.BufferGeometry>();
export function bodyGeometry(shape: Shape): THREE.BufferGeometry {
  const hit = cache.get(shape);
  if (hit) return hit;
  let geometry: THREE.BufferGeometry;
  if (shape === "cube") geometry = new RoundedBoxGeometry(1, 1, 1, 6, 0.22);
  else {
    const points = [new THREE.Vector2(0, -0.5)];
    for (let i = 0; i <= 48; i++) points.push(new THREE.Vector2(Math.max(5e-4, profile(shape, i / 48)), i / 48 - 0.5));
    points.push(new THREE.Vector2(0, 0.5));
    geometry = new THREE.LatheGeometry(points, 48);
  }
  geometry.computeVertexNormals();
  cache.set(shape, geometry);
  return geometry;
}

/** Face position on the front surface at eye height t, for a body scaled to [w, h, d]. */
export function facePoint(shape: Shape, t: number, [, h, d]: [number, number, number]): THREE.Vector3 {
  const r = shape === "cube" ? 0.5 : profile(shape, t);
  return new THREE.Vector3(0, (t - 0.5) * h, r * d + 0.005);
}
```

Material: `MeshPhysicalMaterial` with `clearcoat ≈ 0.55`, `sheen ≈ 0.35`, `roughness ≈ 0.42`; inject a colour gradient
and a small normal-direction jiggle through `onBeforeCompile` uniforms (`uTime`, `uWobble`), set `uWobble = 0` for
reduced motion.

## 2. Mood from real signals

The mood is presentation, but every branch reads a real field, and the reason travels with it so the UI can show it.

```ts
type Mood = "focused" | "excited" | "content" | "cheerful" | "relaxed" | "restless" | "frustrated" | "tired" | "dreaming" | "asleep";
interface Signals {
  activity: "working" | "thinking" | "queued" | "paused" | "idle" | "error" | "planned" | "disabled";
  pausedFor?: "quota" | "sign-in";
  lastSuccessAt?: number; lastFailureAt?: number;
  budgetUsed?: number; // 0..1 of today's budget
  talking: boolean; onBreak: boolean;
}

export function moodOf(s: Signals, now = Date.now()): { mood: Mood; reason: string } {
  const min = 60_000;
  const failed = (s.lastFailureAt ?? 0) > now - 30 * min;
  const succeeded = (s.lastSuccessAt ?? 0) > now - 10 * min;
  if (s.activity === "planned") return { mood: "dreaming", reason: "planned" };
  if (s.activity === "disabled") return { mood: "asleep", reason: "disabled" };
  if (s.activity === "error") return { mood: "frustrated", reason: "error" };
  if (s.activity === "working" || s.activity === "thinking") return { mood: failed ? "restless" : "focused", reason: s.activity };
  if (s.activity === "paused") return { mood: "restless", reason: s.pausedFor === "quota" ? "waitingQuota" : "waitingSignIn" };
  if (s.activity === "queued") return { mood: "restless", reason: "queued" };
  if (failed) return { mood: "frustrated", reason: "recentFailure" };
  if ((s.budgetUsed ?? 0) >= 0.85) return { mood: "tired", reason: "budgetHigh" };
  if (succeeded) return { mood: s.talking ? "cheerful" : "excited", reason: "recentSuccess" };
  if (s.talking) return { mood: "cheerful", reason: "talking" };
  return { mood: s.onBreak ? "relaxed" : "content", reason: s.onBreak ? "onBreak" : "idle" };
}
```

Unit-test it with fixed timestamps; it is the part reviewers will question.

## 3. Static merge (draw-call budget)

Merge every static `MeshStandardMaterial` mesh below a group into one mesh per material and shadow flag. Anything
clickable, animated or textured carries `userData.keep = true` somewhere above it.

```tsx
import { useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const kept = (o: THREE.Object3D, root: THREE.Object3D) => {
  for (let n: THREE.Object3D | null = o; n && n !== root; n = n.parent) if (n.userData.keep) return true;
  return false;
};

export function StaticMerge({ children, deps }: { children: ReactNode; deps: unknown[] }) {
  const root = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    const group = root.current!;
    group.updateWorldMatrix(true, true);
    const inverse = group.matrixWorld.clone().invert();
    const buckets = new Map<string, { material: THREE.Material; cast: boolean; parts: THREE.BufferGeometry[] }>();
    const sources: THREE.Mesh[] = [];
    group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || (mesh as THREE.InstancedMesh).isInstancedMesh || mesh.userData.merged || !mesh.visible) return;
      if (!(mesh.material instanceof THREE.MeshStandardMaterial) || kept(mesh, group)) return;
      const cast = !mesh.material.transparent && mesh.scale.y > 0.3; // only big pieces cast shadows
      const g = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      for (const name of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(name)) g.deleteAttribute(name);
      g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld));
      const key = `${mesh.material.uuid}:${cast}`;
      const bucket = buckets.get(key) ?? { material: mesh.material, cast, parts: [] };
      bucket.parts.push(g);
      buckets.set(key, bucket);
      sources.push(mesh);
    });
    const merged: THREE.Mesh[] = [];
    for (const { material, cast, parts } of buckets.values()) {
      const geometry = mergeGeometries(parts, false);
      parts.forEach((p) => p.dispose());
      if (!geometry) continue;
      const mesh = new THREE.Mesh(geometry, material);
      Object.assign(mesh, { castShadow: cast, receiveShadow: true, matrixAutoUpdate: false });
      mesh.userData.merged = true;
      group.add(mesh);
      merged.push(mesh);
    }
    sources.forEach((m) => (m.visible = false));
    return () => {
      merged.forEach((m) => { group.remove(m); m.geometry.dispose(); });
      sources.forEach((m) => (m.visible = true));
    };
  }, deps); // re-merge when the layout changes (e.g. a floor gains furniture)
  return <group ref={root}>{children}</group>;
}
```

## 4. Bubbles as depth-tested billboards

A plane with a canvas texture copies the camera rotation every frame. `depthTest: true` lets walls, floors and screens
hide exactly the covered part; `depthWrite: false` keeps bubbles from hiding each other's edges.

```tsx
function BubbleBoard({ target, paint, signature }: {
  target: THREE.Object3D; // the character
  paint: (ctx: CanvasRenderingContext2D) => number; // returns used height in canvas pixels
  signature: string; // repaint only when the content changes
}) {
  const W = 720, H = 360, METRES = 1.5 / W;
  const mesh = useRef<THREE.Mesh>(null);
  const used = useRef(H);
  const { canvas, texture, material } = useMemo(() => {
    const canvas = Object.assign(document.createElement("canvas"), { width: W, height: H });
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: true, depthWrite: false, toneMapped: false });
    return { canvas, texture, material };
  }, []);
  useEffect(() => {
    used.current = paint(canvas.getContext("2d")!);
    texture.repeat.set(1, used.current / H); // show only the painted part
    texture.offset.set(0, 1 - used.current / H);
    texture.needsUpdate = true;
  }, [signature]);
  useEffect(() => () => { texture.dispose(); material.dispose(); }, []);
  const head = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    const board = mesh.current!;
    target.getWorldPosition(head);
    const scale = THREE.MathUtils.clamp(camera.position.distanceTo(head) / 9, 0.42, 3.4);
    const h = used.current * METRES * scale;
    board.scale.set(W * METRES * scale, h, 1);
    board.position.set(head.x, head.y + 0.9 + h / 2, head.z);
    board.quaternion.copy(camera.quaternion);
  });
  return <mesh ref={mesh} material={material} renderOrder={10} frustumCulled={false}><planeGeometry /></mesh>;
}
```

Declutter ten times a second: project each visible bubble to screen space, sort by distance, push later ones up until
they no longer overlap, convert the pixel shift back to metres (`px per metre = viewportHeight / (2·d·tan(fov/2))`)
and ease towards it. The name tag is a second, smaller billboard without background (white text with a dark stroke).

## 5. Screens you can use: text hit-testing

The painter returns the text geometry it drew, so a pointer UV maps to a character.

```ts
interface VisualLine { text: string; font: string; x: number }
interface TextRegion { x: number; y: number; w: number; h: number; lineH: number; lines: VisualLine[]; first: number; count: number }
interface TextPoint { region: number; line: number; col: number }

// In the pointer handler: const px = uv.x * canvas.width, py = (1 - uv.y) * canvas.height.
export function hitText(ctx: CanvasRenderingContext2D, regions: TextRegion[], px: number, py: number): TextPoint | null {
  for (const [index, r] of regions.entries()) {
    if (px < r.x || px > r.x + r.w || py < r.y || py > r.y + r.h) continue;
    const row = Math.min(r.count - 1, Math.floor((py - r.y) / r.lineH));
    const lineIndex = Math.min(r.lines.length - 1, r.first + row);
    const line = r.lines[lineIndex];
    if (!line) return null;
    ctx.font = line.font;
    const local = px - r.x - line.x;
    let col = 0; // the caret goes after a character once the pointer passes its middle
    while (col < line.text.length && ctx.measureText(line.text.slice(0, col + 1)).width - ctx.measureText(line.text[col]!).width / 2 < local) col++;
    return { region: index, line: lineIndex, col };
  }
  return null;
}

export function selectedText(r: TextRegion, a: TextPoint, b: TextPoint): string {
  const [s, e] = a.line < b.line || (a.line === b.line && a.col <= b.col) ? [a, b] : [b, a];
  const out: string[] = [];
  for (let i = s.line; i <= e.line; i++) {
    const text = r.lines[i]?.text ?? "";
    out.push(text.slice(i === s.line ? s.col : 0, i === e.line ? e.col : text.length));
  }
  return out.join("\n");
}
```

Copy with `navigator.clipboard.writeText` and fall back to a temporary textarea with `document.execCommand("copy")`.
In Electron tests, verify the clipboard from the main process: `app.evaluate(({ clipboard }) => clipboard.readText())`.

## 6. Split screen with one canvas

```tsx
export function SplitRenderer({ eyes }: { eyes: Array<{ eye: THREE.Vector3; look: THREE.Vector3; self?: THREE.Object3D }> }) {
  const { gl, scene, size } = useThree();
  const cameras = useMemo(() => [] as THREE.PerspectiveCamera[], []);
  useFrame(() => {
    const cols = Math.ceil(Math.sqrt(eyes.length * (size.width / size.height) / 1.5)) || 1;
    const rows = Math.ceil(eyes.length / cols) || 1;
    const w = Math.floor(size.width / cols), h = Math.floor(size.height / rows);
    gl.setScissorTest(true);
    eyes.forEach(({ eye, look, self }, i) => {
      const camera = (cameras[i] ??= new THREE.PerspectiveCamera(62, 1, 0.05, 900));
      const x = (i % cols) * w, y = size.height - (Math.floor(i / cols) + 1) * h;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      camera.position.copy(eye); camera.lookAt(look);
      if (self) self.visible = false; // never render your own head
      gl.setViewport(x, y, w, h); gl.setScissor(x, y, w, h);
      gl.render(scene, camera);
      if (self) self.visible = true;
    });
    gl.setScissorTest(false);
  }, 1); // priority 1 takes over rendering while mounted
  return null;
}
```

Overlay a CSS grid with the same cell layout for names and status.

## 7. Subject beside an info panel

Orbit cameras: convert half the covered width into metres at the orbit distance and use a focal offset.
First person: shift the projection instead.

```ts
const covered = canvas.getBoundingClientRect().right - panel.getBoundingClientRect().left + 12; // px
// Orbit (drei CameraControls):
const metresPerPixel = (2 * controls.distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / canvas.clientHeight;
void controls.setFocalOffset(Math.max(0, covered / 2) * metresPerPixel, 0, 0, true);
// First person:
camera.setViewOffset(canvas.clientWidth, canvas.clientHeight, covered / 2, 0, canvas.clientWidth, canvas.clientHeight);
// When the panel closes: camera.clearViewOffset();
```

## 8. Exploded floors

```ts
const FLOOR_H = 3.4, GAP = 6.4;
/** explode 0..1 eased; focus = the floor being looked at (null for all). */
export function levelY(level: number, explode: number, focus: number | null): number {
  const lift = focus !== null && level > focus ? explode * 9 : 0; // floors above the focus move out of the way
  return level * (FLOOR_H + explode * GAP) + lift;
}
```

Everything on a floor — furniture group, characters, bubbles, elevator riders — goes through the same function.
