import { AIModel, AITool, Conversation, Folder, MemoryEntry, UserPreferences, UserProfile } from '@/types/chat';

export const MOCK_MODELS: AIModel[] = [
  {
    id: 'aura-4.5-sonar',
    name: 'Aura 4.5 Sonar',
    badge: 'Default',
    tagline: 'Deep reasoning, multimodal vision, and real-time tool orchestration',
    description: 'Our most capable model for complex multi-step reasoning, architectural synthesis, and code generation.',
    contextWindow: '1M tokens',
    speed: 'Balanced',
    capabilities: ['reasoning', 'vision', 'coding', 'tools', 'search'],
    isDefault: true,
  },
  {
    id: 'aura-3.5-flash',
    name: 'Aura Flash 3.5',
    badge: 'Fast',
    tagline: 'Near-instantaneous latency for interactive brainstorming & queries',
    description: 'Engineered for high-throughput responses, quick code reviews, and instant question answering with minimal latency.',
    contextWindow: '512K tokens',
    speed: 'Ultra Fast',
    capabilities: ['coding', 'tools', 'search'],
  },
  {
    id: 'aura-deep-thinker',
    name: 'Aura Deep Thinker',
    badge: 'Reasoning',
    tagline: 'Extended chain-of-thought proofs and scientific problem solving',
    description: 'Allocates massive compute to step-by-step mathematical reasoning, algorithmic verification, and rigorous formal logic.',
    contextWindow: '256K tokens',
    speed: 'Deep Reasoning',
    capabilities: ['reasoning', 'coding'],
  },
  {
    id: 'aura-codecraft-pro',
    name: 'Aura Codecraft Pro',
    badge: 'Engineering',
    tagline: 'Specialized for systems architecture, refactoring, and AST manipulation',
    description: 'Fine-tuned on production repositories, unit test generation, CI/CD pipeline automation, and multi-file codebases.',
    contextWindow: '512K tokens',
    speed: 'Balanced',
    capabilities: ['coding', 'tools'],
  },
];

export const MOCK_TOOLS: AITool[] = [
  {
    id: 'tool-web-search',
    name: 'Live Web Search',
    category: 'Information Retrieval',
    description: 'Grounds responses with real-time web documents, research whitepapers, and live news articles.',
    iconName: 'Globe',
    isEnabled: true,
    status: 'connected',
    lastUsed: '10 minutes ago',
  },
  {
    id: 'tool-code-interpreter',
    name: 'Python Sandbox',
    category: 'Code Execution',
    description: 'Executes secure isolated Python 3.12 code with numpy, pandas, scipy, and matplotlib output visualization.',
    iconName: 'Code',
    isEnabled: true,
    status: 'connected',
    lastUsed: 'Just now',
  },
  {
    id: 'tool-google-calendar',
    name: 'Google Calendar Sync',
    category: 'Productivity',
    description: 'Queries schedule availability, schedules conflict-free meetings, and generates agenda briefings.',
    iconName: 'Calendar',
    isEnabled: true,
    status: 'connected',
    lastUsed: '2 hours ago',
  },
  {
    id: 'tool-google-drive',
    name: 'Cloud Drive & Docs',
    category: 'Knowledge Base',
    description: 'Indexes team markdown specs, Google Docs, PDF reports, and architecture decision records.',
    iconName: 'FolderKanban',
    isEnabled: false,
    status: 'needs_auth',
    lastUsed: 'Yesterday',
  },
  {
    id: 'tool-github-connector',
    name: 'GitHub Repositories',
    category: 'Developer Tools',
    description: 'Inspects pull requests, parses Git diffs, searches issues, and reviews release branches.',
    iconName: 'GitBranch',
    isEnabled: true,
    status: 'connected',
    lastUsed: 'Yesterday',
  },
];

export const MOCK_FOLDERS: Folder[] = [
  { id: 'folder-engineering', name: 'Systems Engineering', color: '#6366f1', isExpanded: true },
  { id: 'folder-research', name: 'AI & Quantum Research', color: '#10b981', isExpanded: true },
  { id: 'folder-product', name: 'Product Roadmaps', color: '#f59e0b', isExpanded: false },
];

export const MOCK_USER: UserProfile = {
  name: 'Ahmed Rabbi',
  email: 'ahmedrabbi.ff@gmail.com',
  planTier: 'Pro Workspace',
  usage: {
    fastQueriesUsed: 842,
    fastQueriesLimit: 1000,
    deepQueriesUsed: 38,
    deepQueriesLimit: 50,
    storageUsedGb: 1.8,
    storageLimitGb: 10.0,
    resetDays: 14,
  },
};

export const MOCK_MEMORIES: MemoryEntry[] = [
  {
    id: 'mem-1',
    fact: 'Prefers TypeScript over plain JavaScript with strict type safety and interface definitions.',
    category: 'preference',
    confidence: 0.98,
    dateAdded: '2026-09-12',
  },
  {
    id: 'mem-2',
    fact: 'Primary workspace architecture is Next.js 15 App Router with Tailwind CSS v4 styling.',
    category: 'technical',
    confidence: 0.95,
    dateAdded: '2026-09-15',
  },
  {
    id: 'mem-3',
    fact: 'Focuses on low-latency streaming UX, accessible WCAG AA contrast, and zero layout shift.',
    category: 'work',
    confidence: 0.92,
    dateAdded: '2026-09-20',
  },
  {
    id: 'mem-4',
    fact: 'Located in Pacific Time Zone (PST) with meetings preferred between 10am and 4pm.',
    category: 'personal',
    confidence: 0.9,
    dateAdded: '2026-09-22',
  },
];

export const INITIAL_PREFERENCES: UserPreferences = {
  theme: 'dark',
  sendOnEnter: true,
  systemInstructions: 'You are Aura, an elite AI research engineer and collaborative technical partner. Provide concise, mathematically verified, and beautifully formatted answers with production-ready code examples.',
  enableMemory: true,
  streamSpeedMs: 14,
  defaultModelId: 'aura-4.5-sonar',
  compactMode: false,
  soundEnabled: true,
  codeLineNumbers: true,
};

export const STATIC_BASE_TIME = 1774640000000;

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'chat-quantum-algo',
    title: 'Shor & Grover Quantum Algorithms',
    createdAt: STATIC_BASE_TIME - 1000 * 60 * 45, // 45 mins ago
    updatedAt: STATIC_BASE_TIME - 1000 * 60 * 12,
    modelId: 'aura-4.5-sonar',
    folderId: 'folder-research',
    isPinned: true,
    messages: [
      {
        id: 'msg-q1',
        role: 'user',
        content: 'Could you compare Shor\'s algorithm and Grover\'s algorithm in terms of quantum speedup, algorithmic complexity, and mathematical formulation for the oracle function?',
        createdAt: STATIC_BASE_TIME - 1000 * 60 * 40,
      },
      {
        id: 'msg-q2',
        role: 'assistant',
        modelId: 'aura-4.5-sonar',
        createdAt: STATIC_BASE_TIME - 1000 * 60 * 39,
        reasoning: {
          thinkingTime: 3.8,
          steps: [
            'Deconstruct the comparative query into: asymptotic speedup, domain application, and oracle mechanics.',
            'Formulate the mathematical definition of Grover\'s diffusion operator and Shor\'s quantum Fourier transform order finding.',
            'Derive exact Big-O complexities and compile structured comparison matrix for clarity.',
          ],
          content: 'The user wants a rigorous mathematical and architectural comparison between Shor\'s and Grover\'s algorithms. I will detail the polynomial vs quadratic speedup regimes, provide KaTeX equations for both the phase oracle and quantum Fourier transform order-finding state, and summarize in a high-density comparative table.',
        },
        content: `Here is a formal comparison of **Shor's Algorithm** and **Grover's Algorithm**, highlighting their fundamental mathematical structures and computational speedups:

### 1. Fundamental Asymptotic Speedup

* **Shor's Algorithm (Order Finding / Factoring)**: Provides an **exponential speedup** over the best known classical general number field sieve ($O(e^{\sqrt[3]{n}})). It solves discrete logarithms and prime factorization in polynomial time:
$$\\mathcal{O}\\left((\\log N)^2 \\log \\log N \\cdot \\log \\log \\log N\\right)$$

* **Grover's Algorithm (Unstructured Search)**: Delivers a provably optimal **quadratic speedup** for black-box search through an unsorted search space of $N = 2^n$ elements:
$$\\mathcal{O}\\left(\\sqrt{N}\\right) \\quad \\text{vs. classical} \\quad \\mathcal{O}(N)$$

---

### 2. Mathematical Formulations

#### A. Grover's Diffusion & Phase Inversion
In Grover's search, given an oracle $U_w$ that marks the target state $|w\\rangle$ with a negative phase:
$$U_w |x\\rangle = (-1)^{f(x)} |x\\rangle = \\begin{cases} -|x\\rangle & \\text{if } x = w \\\\ |x\\rangle & \\text{if } x \\neq w \\end{cases}$$

The diffusion operator $D$ inverts amplitudes around the uniform superposition mean $|s\\rangle$:
$$D = 2|s\\rangle\\langle s| - I \\quad \\text{where} \\quad |s\\rangle = \\frac{1}{\\sqrt{N}} \\sum_{x=0}^{N-1} |x\\rangle$$

#### B. Shor's Quantum Period Finding
Shor relies on the Quantum Fourier Transform (QFT) to extract period $r$ where $a^r \\equiv 1 \\pmod N$:
$$\\text{QFT}_M |x\\rangle = \\frac{1}{\\sqrt{M}} \\sum_{y=0}^{M-1} \\exp\\left( \\frac{2\\pi i x y}{M} \\right) |y\\rangle$$

---

### 3. High-Level Comparison Table

| Attribute | Shor's Algorithm | Grover's Algorithm |
| :--- | :--- | :--- |
| **Speedup Class** | Exponential | Quadratic |
| **Primary Domain** | Number theory, RSA/ECC Cryptanalysis | Unstructured database search, Collision finding |
| **Key Mechanism** | Quantum Fourier Transform (Phase Estimation) | Amplitude Amplification via Reflection |
| **Classical Query Bound** | Sub-exponential $\\mathcal{O}(e^{c \\sqrt[3]{n}})$ | Linear $\\mathcal{O}(N)$ |
| **Quantum Query Bound** | Polynomial $\\mathcal{O}(n^3)$ | $\\mathcal{O}(\\sqrt{N})$ |
| **Error Tolerance** | Strict fault-tolerance required | Tolerant to bounded noisy intermediate states |`,
        feedback: 'like',
      },
    ],
  },
  {
    id: 'chat-distributed-kv',
    title: 'Distributed KV Store Architecture (Raft)',
    createdAt: STATIC_BASE_TIME - 1000 * 60 * 60 * 3, // 3 hours ago
    updatedAt: STATIC_BASE_TIME - 1000 * 60 * 30,
    modelId: 'aura-codecraft-pro',
    folderId: 'folder-engineering',
    isPinned: false,
    messages: [
      {
        id: 'msg-k1',
        role: 'user',
        content: 'Show me an idiomatic TypeScript implementation of a thread-safe in-memory Key-Value store with TTL expiration, Raft term fencing, and atomic commit semantics.',
        createdAt: STATIC_BASE_TIME - 1000 * 60 * 180,
      },
      {
        id: 'msg-k2',
        role: 'assistant',
        modelId: 'aura-codecraft-pro',
        createdAt: STATIC_BASE_TIME - 1000 * 60 * 179,
        reasoning: {
          thinkingTime: 2.4,
          steps: [
            'Analyze state machine invariants: key, value, ttl, term lease, and monotonic log index.',
            'Implement thread-safe async locks or atomic CAS map patterns.',
            'Add background sweeper interval with clean disposal to prevent memory leaks.',
          ],
          content: 'Drafting a clean TypeScript class with atomic operations, Raft term fencing, and millisecond-precision active TTL expiration.',
        },
        content: `Here is a production-grade TypeScript implementation of a partitioned in-memory Key-Value store with Raft term fencing, atomic CAS (Compare-And-Swap), and active TTL eviction:

\`\`\`typescript
interface StoreEntry<T> {
  value: T;
  version: number;
  term: number;
  expiresAt: number | null;
}

export class RaftFencedStore<T = unknown> {
  private readonly store = new Map<string, StoreEntry<T>>();
  private currentTerm = 0;
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly cleanupIntervalMs = 5000) {
    this.startJanitor();
  }

  /**
   * Update the active cluster leader term. All writes with lower terms will be rejected.
   */
  public updateTerm(newTerm: number): void {
    if (newTerm < this.currentTerm) {
      throw new Error(\`Stale term: received \${newTerm} while active term is \${this.currentTerm}\`);
    }
    this.currentTerm = newTerm;
  }

  /**
   * Atomic Put with Raft Term Fencing and optional TTL in milliseconds.
   */
  public put(key: string, value: T, term: number, ttlMs?: number): boolean {
    if (term < this.currentTerm) {
      return false; // Fenced out by newer leader
    }

    const now = Date.now();
    const existing = this.store.get(key);
    const version = existing ? existing.version + 1 : 1;

    this.store.set(key, {
      value,
      version,
      term,
      expiresAt: ttlMs ? now + ttlMs : null,
    });

    return true;
  }

  /**
   * Retrieves an item if not expired.
   */
  public get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  private startJanitor(): void {
    this.timer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (entry.expiresAt && now > entry.expiresAt) {
          this.store.delete(key);
        }
      }
    }, this.cleanupIntervalMs);
  }

  public destroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.store.clear();
  }
}
\`\`\`

### Invariant Guarantees:
1. **Term Fencing**: Any zombie partition leader attempting to write with $T_{\\text{write}} < T_{\\text{current}}$ fails immediately.
2. **Deterministic Cleanup**: Expired items are lazy-evaluated on \`get()\` and actively purged by the timer loop.
3. **Monotonic Versioning**: Every key mutation increments an internal epoch revision.`,
        feedback: 'like',
      },
    ],
  },
  {
    id: 'chat-web-search-demo',
    title: 'Next-Gen Solid State Battery Patents 2026',
    createdAt: STATIC_BASE_TIME - 1000 * 60 * 60 * 24, // Yesterday
    updatedAt: STATIC_BASE_TIME - 1000 * 60 * 60 * 22,
    modelId: 'aura-4.5-sonar',
    folderId: 'folder-research',
    isPinned: false,
    messages: [
      {
        id: 'msg-s1',
        role: 'user',
        content: 'Search the web for the latest commercial breakthroughs in silicon anode solid-state battery manufacturing and energy density targets announced this quarter.',
        createdAt: STATIC_BASE_TIME - 1000 * 60 * 60 * 24,
      },
      {
        id: 'msg-s2',
        role: 'assistant',
        modelId: 'aura-4.5-sonar',
        createdAt: STATIC_BASE_TIME - 1000 * 60 * 60 * 23,
        toolCalls: [
          {
            id: 'call-search-1',
            name: 'Live Web Search',
            label: 'web_search',
            status: 'completed',
            input: {
              query: 'solid state battery silicon anode commercial energy density breakthrough 2026',
              domain_filters: ['nature.com', 'energy.gov', 'reuters.com'],
            },
            result: {
              resultsCount: 8,
              topSummary: 'Recent Q1 2026 pilot lines report gravimetric densities achieving 450-520 Wh/kg utilizing sulfide-based solid electrolytes coupled with 100% micro-silicon composite anodes.',
            },
            timestamp: '14:22:04',
          },
        ],
        citations: [
          {
            title: 'Nature Energy: High-Rate Sulfide Solid Electrolytes for Pure Silicon Anodes',
            url: 'https://nature.com/articles/s41560-026-0129-x',
            snippet: 'Demonstration of 1,200 continuous cycles at 4C fast-charging with <0.02% volume expansion degradation using elastomeric buffer matrices.',
            domain: 'nature.com',
          },
          {
            title: 'DOE National Renewable Energy Lab: Commercial Cell Benchmarking Report',
            url: 'https://energy.gov/eere/vehicles/articles/2026-solid-state-roadmap',
            snippet: 'Cell-level volumetric energy density reached 1,150 Wh/L, exceeding the 2026 EV commercialization milestone ahead of scheduled automotive integration.',
            domain: 'energy.gov',
          },
          {
            title: 'Reuters Tech: Next-Gen Battery Gigafactories Break Ground in North America',
            url: 'https://reuters.com/business/energy/solid-state-pilot-plants-2026',
            snippet: 'Three tier-1 manufacturers announced dry-electrode roll-to-roll continuous processing lines reducing gigawatt manufacturing capex by 38%.',
            domain: 'reuters.com',
          },
        ],
        content: `Based on verified literature and industry announcements this quarter, solid-state battery technology with high-content silicon anodes has crossed three crucial commercialization milestones:

### 1. Energy Density Targets Achieved
* **Gravimetric Density**: Benchmarked between **$450\\text{ Wh/kg}$ and $520\\text{ Wh/kg}$**, representing a $\\approx 80\\%$ uplift over conventional graphite/NMC811 cylindrical cells.
* **Volumetric Density**: Crossed **$1,150\\text{ Wh/L}$**, which enables thinner pack designs for electric aviation and hyper-mile passenger vehicles.

### 2. Critical Mechanical Breakthroughs
The historic bottleneck of silicon anodes has been **volumetric breathing** (expanding up to $300\\%$ during lithiation, pulverizing the solid-electrolyte interphase). 
Recent papers confirm the deployment of **self-healing elastomeric binders** and **sulfide ceramic glasses** ($Li_{10}GeP_2S_{12}$ derivatives) that absorb uniaxial expansion pressures under low stack pressure ($<1\\text{ MPa}$).

### 3. Manufacturing Scaling
Pilot production is moving rapidly from pouch batch testing to **dry-electrode roll-to-roll fabrication**, cutting solvent drying oven footprints by $70\\%$ and reducing per-kWh pack production costs to $\\approx \\$78/\\text{kWh}$.`,
        feedback: null,
      },
    ],
  },
  {
    id: 'chat-math-euler',
    title: 'Riemann Zeta Function & Basel Problem',
    createdAt: STATIC_BASE_TIME - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    updatedAt: STATIC_BASE_TIME - 1000 * 60 * 60 * 24 * 3,
    modelId: 'aura-deep-thinker',
    folderId: 'folder-research',
    isPinned: false,
    messages: [
      {
        id: 'msg-m1',
        role: 'user',
        content: 'Derive Euler\'s solution to the Basel Problem using the Taylor expansion of $\\sin(x)$ and infinite product factorizations.',
        createdAt: STATIC_BASE_TIME - 1000 * 60 * 60 * 72,
      },
      {
        id: 'msg-m2',
        role: 'assistant',
        modelId: 'aura-deep-thinker',
        createdAt: STATIC_BASE_TIME - 1000 * 60 * 60 * 71,
        content: `Here is Euler's original 1734 derivation of the Basel Problem evaluating $\\zeta(2) = \\sum_{n=1}^{\\infty} \\frac{1}{n^2}$:

### 1. The Taylor Series of $\\frac{\\sin x}{x}$
The standard Maclaurin series for the sine function is:
$$\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!} + \\dots$$

Dividing through by $x$ gives:
$$\\frac{\\sin x}{x} = 1 - \\frac{x^2}{6} + \\frac{x^4}{120} - \\dots$$

### 2. Infinite Product Representation
The roots of $\\frac{\\sin x}{x} = 0$ occur precisely at non-zero multiples of $\\pi$: $x = \\pm \\pi, \\pm 2\\pi, \\pm 3\\pi, \\dots$

Assuming this function can be factored across its roots like a polynomial (the Weierstrass factorization theorem):
$$\\frac{\\sin x}{x} = \\prod_{n=1}^{\\infty} \\left(1 - \\frac{x^2}{n^2 \\pi^2}\\right) = \\left(1 - \\frac{x^2}{\\pi^2}\\right)\\left(1 - \\frac{x^2}{4\\pi^2}\\right)\\left(1 - \\frac{x^2}{9\\pi^2}\\right)\\dots$$

### 3. Equating the $x^2$ Coefficients
Expanding the product, the coefficient of the $x^2$ term is:
$$-\\left(\\frac{1}{\\pi^2} + \\frac{1}{4\\pi^2} + \\frac{1}{9\\pi^2} + \\dots\\right) = -\\frac{1}{\\pi^2} \\sum_{n=1}^{\\infty} \\frac{1}{n^2}$$

Equating this with the $x^2$ coefficient from the Taylor expansion $\\left(-\\frac{1}{6}\\right)$:
$$-\\frac{1}{\\pi^2} \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = -\\frac{1}{6}$$

Multiplying both sides by $-\\pi^2$ yields the closed-form identity:
$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$`,
        feedback: 'like',
      },
    ],
  },
];

export const PROMPT_SUGGESTIONS = [
  {
    category: 'Engineering & Code',
    icon: 'Code2',
    title: 'Implement Raft consensus election logic',
    prompt: 'Write a TypeScript implementation of the Raft leader election state machine with randomized heartbeat timeouts and vote tallying.',
  },
  {
    category: 'Mathematics & Proofs',
    icon: 'Sigma',
    title: 'Solve Black-Scholes PDE derivation',
    prompt: 'Derive the Black-Scholes partial differential equation using Itô\'s Lemma and dynamic delta hedging step-by-step with LaTeX equations.',
  },
  {
    category: 'System Design',
    icon: 'Network',
    title: 'Architect a 10M DAU event ingestion pipeline',
    prompt: 'Design an event-driven telemetry ingestion architecture supporting 10M daily active devices with Kafka, ClickHouse, and zero data loss.',
  },
  {
    category: 'Research & Search',
    icon: 'Globe',
    title: 'Search latest LLM speculative decoding methods',
    prompt: 'Search the web for 2026 breakthroughs in multi-token speculative decoding and draft an architectural trade-off analysis.',
  },
];
