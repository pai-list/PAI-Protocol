import{_ as s,o as n,c as e,a2 as p}from"./chunks/framework.CHeM0PsO.js";const g=JSON.parse('{"title":"PAI Protocol Architecture","description":"","frontmatter":{},"headers":[],"relativePath":"whitepaper/architecture.md","filePath":"whitepaper/architecture.md"}'),i={name:"whitepaper/architecture.md"};function l(t,a,r,o,c,h){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="pai-protocol-architecture" tabindex="-1">PAI Protocol Architecture <a class="header-anchor" href="#pai-protocol-architecture" aria-label="Permalink to &quot;PAI Protocol Architecture&quot;">​</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-label="Permalink to &quot;Overview&quot;">​</a></h2><p>The PAI Protocol (PPP) implements a layered architecture optimized for autonomous agent communication.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                    Application Layer                           │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  Agents │ Wallets │ dApps │ Skills │ Marketplace            │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                    Protocol Layer (PPP)                       │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │</span></span>
<span class="line"><span>│  │  Auth    │ │ Routing  │ │ Serial.  │ │  Compression │   │</span></span>
<span class="line"><span>│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                    Transport Layer                             │</span></span>
<span class="line"><span>│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │</span></span>
<span class="line"><span>│  │ HTTP   │ │  WS    │ │  QUIC  │ │ libp2p │ │  Email   │  │</span></span>
<span class="line"><span>│  └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘  │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────┘</span></span></code></pre></div><h2 id="design-principles" tabindex="-1">Design Principles <a class="header-anchor" href="#design-principles" aria-label="Permalink to &quot;Design Principles&quot;">​</a></h2><h3 id="_1-protocol-minimalism" tabindex="-1">1. Protocol Minimalism <a class="header-anchor" href="#_1-protocol-minimalism" aria-label="Permalink to &quot;1. Protocol Minimalism&quot;">​</a></h3><ul><li><strong>Minimal header</strong>: Only essential routing fields</li><li><strong>Extensible body</strong>: JSON Schema for extensibility</li><li><strong>Optional receipt</strong>: Only when verification needed</li></ul><h3 id="_2-transport-agnosticism" tabindex="-1">2. Transport Agnosticism <a class="header-anchor" href="#_2-transport-agnosticism" aria-label="Permalink to &quot;2. Transport Agnosticism&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Application</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ▼</span></span>
<span class="line"><span>PPP Message (canonical)</span></span>
<span class="line"><span>    │</span></span>
<span class="line"><span>    ├─► HTTP/1.1, HTTP/2, HTTP/3</span></span>
<span class="line"><span>    ├─► WebSocket</span></span>
<span class="line"><span>    ├─► QUIC / HTTP/3</span></span>
<span class="line"><span>    ├─► libp2p / QUIC</span></span>
<span class="line"><span>    ├─► SMTP / Email</span></span>
<span class="line"><span>    ├─► Matrix / IRC</span></span>
<span class="line"><span>    └─► Custom transports</span></span></code></pre></div><h3 id="_3-verifiability-first" tabindex="-1">3. Verifiability First <a class="header-anchor" href="#_3-verifiability-first" aria-label="Permalink to &quot;3. Verifiability First&quot;">​</a></h3><p>Every message <strong>can</strong> carry a receipt:</p><ul><li><strong>Local</strong>: TrustChain hash chain</li><li><strong>Public</strong>: Sigstore/Rekor transparency log</li><li><strong>On-chain</strong>: Pi Network anchoring (periodic)</li></ul><hr><h2 id="message-flow" tabindex="-1">Message Flow <a class="header-anchor" href="#message-flow" aria-label="Permalink to &quot;Message Flow&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─────────┐     .ppp doc      ┌─────────┐</span></span>
<span class="line"><span>│ Sender  │ ───────────────►  │ Gateway │</span></span>
<span class="line"><span>└─────────┘                     └────┬────┘</span></span>
<span class="line"><span>                                     │</span></span>
<span class="line"><span>          ┌──────────────────────────┼──────────────────┐</span></span>
<span class="line"><span>          ▼                          ▼                  ▼</span></span>
<span class="line"><span>    ┌──────────┐              ┌──────────┐        ┌──────────┐</span></span>
<span class="line"><span>    │  Mesh    │                │ Gateway  │        │  Agent   │</span></span>
<span class="line"><span>    │  Mesh    │                │ (Proxy)  │        │  (Sink)  │</span></span>
<span class="line"><span>    └──────────┘                └──────────┘        └──────────┘</span></span></code></pre></div><hr><h2 id="message-lifecycle" tabindex="-1">Message Lifecycle <a class="header-anchor" href="#message-lifecycle" aria-label="Permalink to &quot;Message Lifecycle&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>1. CREATE     ──► Sender creates .ppp document</span></span>
<span class="line"><span>2. SIGN       ──► Sign with sender&#39;s key</span></span>
<span class="line"><span>3. RECEIPT    ──► Generate TrustChain entry + Sigstore entry</span></span>
<span class="line"><span>4. ROUTE      ──► Route via mesh/gateway</span></span>
<span class="line"><span>5. DELIVER    ──► Deliver to recipient</span></span>
<span class="line"><span>6. VERIFY     ──► Recipient verifies signature + receipt</span></span>
<span class="line"><span>6. ACK        ──► Optional: send response .ppp</span></span>
<span class="line"><span>8. ANCHOR     ──► Periodic anchoring to Pi Network</span></span></code></pre></div><hr><h2 id="next-message-format" tabindex="-1">Next: <a href="/spec/message-format.html">Message Format</a> <a class="header-anchor" href="#next-message-format" aria-label="Permalink to &quot;Next: [Message Format](/spec/message-format)&quot;">​</a></h2><p>EOF</p>`,21)])])}const m=s(i,[["render",l]]);export{g as __pageData,m as default};
