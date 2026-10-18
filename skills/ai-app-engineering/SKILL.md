---
name: ai-app-engineering
description: Build professional applications that use AI models and agents — provider connections with model selection,
  apps that run on the user's Codex/ChatGPT subscription through the official Codex App Server exactly like Cadence,
  API-key providers, local models, agent loops, tools, structured output, safety, cost and testing.
metadata:
  creator: Cadence project
  created: '2026-10-10'
  creation-method: Editorial Markdown guide derived from Cadence's own provider, model-policy and Codex App Server
    implementation (src/main/model-providers.mjs, provider-keys.mjs, model-policy.mjs, codex-app-server.mjs, codex-isolation.mjs,
    ADR-0002, ADR-0013) plus general provider practice; no external template or executable scripts.
  purpose: Whenever a project needs AI features or an AI agent system, build it on the same proven architecture
    as Cadence so connection, model choice, security and operation work from the first start.
  scope: Installation-wide; included with planning, implementation, backend, integration and review tasks that mention
    AI, models, agents or providers.
---

# Engineering AI applications the Cadence way

Use this when a request adds AI to a project ("add AI", chatbot, assistant, agent, summarising, classification, generation, RAG) or builds an agent system like Cadence. Pick the connection type first, then follow the shared architecture.

## 1. Choose the connection type
| Situation | Use |
|---|---|
| Local desktop or developer tool for one person who has a ChatGPT/Codex plan; agentic coding or file work | **Codex App Server** with the official ChatGPT sign-in (section 3). Usage counts against that person's plan. |
| Server, web or multi-user product, background jobs, customers without their own plan | **Provider API with an API key** (OpenAI, Anthropic, Google, OpenRouter, DeepSeek, Alibaba Model Studio …), billed per token (section 4). |
| Data must stay on the machine, offline, or cost-free experiments | **Local model server** (Ollama `http://127.0.0.1:11434/v1`, LM Studio `http://127.0.0.1:1234/v1`) via the OpenAI-compatible API. |
| Several of the above | One **provider abstraction** with per-call selection `providerId::modelId` (section 2). |
A subscription sign-in belongs to the person who signed in and runs on their machine. Never proxy one person's ChatGPT/Codex sign-in for other users or a server backend, and never ask users for their ChatGPT password — only the official sign-in flow. For shared or hosted products use API keys under the product's own account. If unsure whether a use is allowed by the provider's terms, say so and ask.

## 2. Shared architecture (all connection types)
- **Module layout:** `src/ai/providers/<provider>.{ts,mjs,py}` (one adapter each, same interface), `src/ai/models.*` (catalog and selection), `src/ai/keys.*` (secure key store), `src/ai/prompts/`, `src/ai/tools/`, `src/ai/schemas/` (JSON Schemas for structured output), `src/ai/agents/` (loops, orchestration), `tests/ai/` (fixtures and evaluations). UI never calls a provider directly; it calls the domain service, which calls the adapter.
- **Provider registry (as in Cadence `model-providers.mjs`):** presets with `id`, `name`, `baseUrl`, `needsKey`, `local`, `note`. Settings per provider: `enabled` (default off), `baseUrl` (validated `https?://`), `models` (fetched list), `allowedModels` (null = all, otherwise an allow-list chosen by the admin). An `active` provider of `none` means nothing runs until someone enables a provider.
- **Model selection id:** store one string per agent/feature: `modelId` for the primary provider (Cadence: Codex) and `providerId::modelId` for others. Parse it at the call site, check that provider and model are enabled and allowed, and send only the raw model id to the API.
- **Model catalog from the provider, never hard-coded:** fetch `GET {baseUrl}/models` (Ollama fallback `/api/tags`; Codex `model/list`), keep only ids matching `^[\w.:/@+-]{1,200}$` and harmless metadata (display name, context length, modalities, price per token), at most 400 entries, sorted. Show the date of the last fetch. A default model is a setting with fallback text, not a constant buried in code (Cadence default: `gpt-6-luna`).
- **Reasoning effort per model:** keep the efforts the catalog reports per model (`supportedReasoningEfforts`) and validate the requested effort against them. If a model or effort is unavailable, fail with a clear message naming what is available. **Never silently switch to another model.**
- **Keys:** store API keys only encrypted with the operating system (Electron `safeStorage`/Windows DPAPI, macOS Keychain, libsecret; on servers a secret manager or environment variables). Never in config files, the repository, logs, prompts, screenshots or error messages; redact anything key-like in logs. If encryption is unavailable, do not store the key. Pass keys to child processes only as environment variables (Cadence: `TAKT_PROVIDER_<ID>_KEY`, referenced by name via `env_key`).
- **Settings UI:** one "AI providers" section in the central settings: per provider a switch, address, key field (write-only, shows "stored"), "Load models", an allow-list with search, a test button that runs a real minimal request, and per agent/feature a model picker plus effort picker that only offers what the catalog reports. Show connection state, plan/quota where available and the last error with one next step.
- **Errors and retries:** timeouts on every call (catalog 6 s, requests by expected length), at most two retries with backoff for 429/5xx/stream drops, idle-stream timeout (Cadence: 300 s), friendly messages for 401/403 ("key rejected"), unreachable host ("is the server running, is the address right?"). Make calls idempotent where results are written (request id, de-duplication on retry).
- **Cost and quota:** record reported token usage per call, per agent and per feature; show it in the UI. Use the lowest effort and smallest model that passes the task's evaluation; raise effort only by rule (risk, failed attempt). Do not convert between subscription quota and token counts — show them separately.
- **Privacy and compliance:** document which data goes to which provider (data-flow table in `docs/ARCHITECTURE.md`), send only what the task needs, offer a local option for sensitive data, keep EU AI Act transparency in mind (label AI-generated content, human decision for consequential actions). Do not claim certifications or compliance the product does not have.

## 3. Apps on the Codex subscription: Codex App Server (exactly like Cadence)
Use the **official Codex App Server over local stdio** — not the deprecated Codex MCP server integration and not experimental transports. Check the installed version first: `codex --version`; generate the exact protocol contract for that version with `codex app-server generate-json-schema --out <dir>` and test against it.
1. **Find the executable** without a shell: on Windows prefer the newest `%LOCALAPPDATA%\OpenAI\Codex\bin\<hash>\codex.exe` (real file, no symlink, inside that folder), else resolve `codex` from PATH. Show a clear "Codex not installed" state if neither exists.
2. **Isolate the app's Codex home:** start with `CODEX_HOME=<app data>/codex-home` so the app's sign-in, history and config are separate from the person's own Codex; write a managed `config.toml` there before each start (disable features the app does not use; disable global skills and MCP servers unless the user allows them).
3. **Spawn:** `spawn(executable, ["app-server", "--stdio"], { shell: false, windowsHide: true, stdio: ["pipe", "pipe", "ignore"], env })`. Read stdout line by line; every line is one JSON-RPC message (`{ id, method, params }` requests, `{ id, result | error }` responses, `{ method, params }` notifications).
4. **Handshake:** request `initialize` with `{ clientInfo: { name, title, version } }`, then send the notification `initialized`.
5. **Account:** `account/read` `{ refreshToken: false }`. No account: show "Connect with ChatGPT". Sign-in: `account/login/start` `{ type: "chatgpt" }` returns `loginId` and `authUrl` — open it in the system browser only if it is `https://chatgpt.com` or `https://auth.openai.com`; alternative `{ type: "chatgptDeviceCode" }` returns `verificationUrl` (`https://auth.openai.com/codex/device`) and `userCode`. Wait for the notification `account/login/completed` with the same `loginId`, then read the account again (`account.type`, `planType`). Cancel with `account/login/cancel`, sign out with `account/logout` (confirm first, never while agents run). React to `account/updated`.
6. **Models:** page through `model/list` `{ limit: 100, includeHidden: false, cursor }` until no `nextCursor`; keep `id`, `displayName`, `supportedReasoningEfforts`. If the catalog fails, start nothing and say so.
7. **Quota:** `account/rateLimits/read` gives the plan's usage windows (for example five-hour and weekly); listen to `account/rateLimits/updated`; per-thread usage via `account/usage/read` `{ threadId }`; token counts via the notification `thread/tokenUsage/updated` (also use it to warn when a session's context gets full and to compact with `thread/compact/start`).
8. **Sessions:** `thread/start` with `{ model, cwd, approvalPolicy, sandbox, developerInstructions, serviceName, config }`. `config` can add `mcp_servers` (the app's own tools, each with a short-lived token) and `model_providers` for API-key providers on the same runtime: `{ model_provider: "app_<id>", model_providers: { app_<id>: { name, base_url, wire_api: "responses", env_key: "APP_PROVIDER_<ID>_KEY", request_max_retries: 2, stream_max_retries: 2, stream_idle_timeout_ms: 300000 } } }` — such providers must support the Responses API (`/v1/responses`) with tool calls; a working model list does not prove that.
9. **Turns:** `turn/start` `{ threadId, input: [{ type: "text", text }], cwd, approvalPolicy, sandboxPolicy, model, effort, summary: "concise", outputSchema }`. Stream `turn/started`, `item/started`, `item/agentMessage/delta`, `item/reasoning/summaryTextDelta`, `item/completed`, `turn/plan/updated`, and finish on `turn/completed`. Interrupt with `turn/interrupt`. Use `outputSchema` (strict JSON Schema, every property required, `additionalProperties: false`) whenever the app parses the answer, then validate it again in code and run a bounded correction turn on violations.
10. **Sandbox and approvals:** read-only work uses `sandbox: "read-only"` and `sandboxPolicy: { type: "readOnly", networkAccess: false }`; writing work uses `sandbox: "workspace-write"` with `{ type: "workspaceWrite", writableRoots: [<absolute project folder>], networkAccess: false }`. `approvalPolicy` is `on-request` when a person supervises and `never` for unattended steps. Answer server requests `item/commandExecution/requestApproval`, `item/fileChange/requestApproval` and `item/permissions/requestApproval` with `{ decision }` chosen only from the offered `availableDecisions` (`accept`, `acceptForSession`, `decline`, `cancel`); if none is supported, reply with an error (fail closed). Show the person what is being approved. `item/tool/requestUserInput` is a question to the person.
11. **Lifecycle:** one shared App Server process; queue requests until ready; on process exit fail open requests, close running turns visibly, clear approvals and offer reconnect. Track a connection generation so a step prepared before a reconnect does not start on the new connection. On Windows check sandbox readiness (`windowsSandbox/readiness`, setup via `windowsSandbox/setupStart`) and run one harmless sandboxed `command/exec` self-test before starting agents.

## 4. API-key providers directly
- Prefer each provider's official SDK or its documented HTTP API; for OpenAI and OpenAI-compatible servers prefer the Responses API, for Anthropic the Messages API, for Google the Gemini API. Read the provider's current documentation for model ids, parameters and limits; do not answer from memory.
- Same rules as section 2: catalog-driven model list, allow-list, encrypted key, explicit errors, retries, timeouts, usage accounting, no silent fallback.
- Streaming for anything a person waits on; cancel the request when the user cancels.
- Use prompt caching or reused context where the provider supports it for long, repeated system prompts.

## 5. Agents, tools and prompts
- **Explicit agent contract:** every agent run is bound to a task id, project id, session id and a recovery point before writing. Log decisions, tool calls, status changes and results — never secrets or unnecessary project content.
- **Tools:** expose narrow, typed tools (JSON Schema input, bounded output) through the app's own MCP server or the SDK's tool interface; check permissions per call from the session context; never let the model run arbitrary shell text from the UI; validate paths against the allowed root and refuse symlink escapes.
- **Prompts:** keep system prompts in versioned files (`src/ai/prompts/`), assemble them from small blocks (role, rules, task, context, output format), include only relevant context, and state the language of the answer. Put rules the code can enforce into code, not only into the prompt.
- **Loops:** bound iterations, time and cost per run; independent review by a different agent or a deterministic check for important results; idempotent retries, handling of cancel, timeouts, process exit and duplicate events.
- **Structured output first** for anything the program consumes; free text only for people.
- **RAG:** chunk with source ids, store embeddings with the document version, cite sources in answers, and evaluate retrieval quality separately from generation.

## 6. Testing and verification
- Unit tests with a **fake provider** or a local JSON-RPC simulator of the App Server (Cadence: `scripts/fixtures/process-app-server.cjs`) — no model calls, no network, deterministic.
- Contract test against the installed Codex version's generated schema.
- Evaluation set in `tests/ai/` with expected outcomes for the main prompts; run it when prompts or models change.
- Live model tests only when the person asked for them; report model, effort and cost.
- Before finishing: the app starts without any provider configured and explains how to connect; a disabled or unavailable model produces a clear message; keys never appear in logs or state files; the settings section works end to end.
