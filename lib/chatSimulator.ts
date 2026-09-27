import { Citation, ReasoningTrace, ToolCall } from '@/types/chat';

export interface SimulatedResponse {
  reasoning?: ReasoningTrace;
  toolCalls?: ToolCall[];
  citations?: Citation[];
  content: string;
}

export function generateMockAIResponse(
  userPrompt: string,
  modelId: string,
  useWebSearch: boolean,
  activeTools: string[]
): SimulatedResponse {
  const promptLower = userPrompt.toLowerCase();

  // If user searched or web search was toggled
  if (useWebSearch || promptLower.includes('search') || promptLower.includes('latest') || promptLower.includes('news')) {
    return {
      reasoning: {
        thinkingTime: 2.1,
        steps: [
          'Identified temporal or search-grounded inquiry.',
          'Formulated search query parameters for live crawler.',
          'Ranked top academic and industry sources.',
          'Extracted verifiable claims and synthesized findings.',
        ],
        content: 'Grounding query with real-time web documents from verified technical publications.',
      },
      toolCalls: [
        {
          id: `call-${Date.now()}`,
          name: 'Live Web Search',
          label: 'web_search',
          status: 'completed',
          input: {
            query: userPrompt.slice(0, 80),
            recency: 'month',
            top_k: 3,
          },
          result: {
            status: 200,
            retrieved_sources: 3,
            latency_ms: 184,
          },
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      citations: [
        {
          title: 'ACM Computing Surveys: Next-Gen Systems & Emerging Paradigms',
          url: 'https://dl.acm.org/surveys/emerging-tech-2026',
          snippet: 'Comprehensive benchmark of low-overhead distributed consensus and high-throughput concurrent memory architectures.',
          domain: 'dl.acm.org',
        },
        {
          title: 'arXiv Computer Science: High-Efficiency Scalable Inference Models',
          url: 'https://arxiv.org/abs/2603.09812',
          snippet: 'Empirical verification demonstrating speculative verification reducing latency by 48% across multi-tenant GPU clusters.',
          domain: 'arxiv.org',
        },
        {
          title: 'MIT Technology Review: Enterprise AI Infrastructure Report',
          url: 'https://technologyreview.com/2026/infrastructure-breakthroughs',
          snippet: 'Analysis of hardware-accelerated memory bandwidth improvements in modern high-performance microclusters.',
          domain: 'technologyreview.com',
        },
      ],
      content: `Based on verified 2026 sources and literature regarding: **"${userPrompt}"**, here are the key insights:

### 1. Architectural Developments
Recent empirical research highlights a transition toward **speculative execution graphs** and **zero-copy zero-serialization RPC layers**. These architectures achieve sub-millisecond tail latencies while maintaining strict serializability guarantees.

### 2. Quantitative Performance Comparison
| Benchmark Dimension | Baseline Standard | Optimized 2026 Model | Efficiency Delta |
| :--- | :--- | :--- | :--- |
| **Inference Latency** | $42.4\\text{ ms}$ | $18.2\\text{ ms}$ | $-57.1\\%$ |
| **P99 Tail SLA** | $120.0\\text{ ms}$ | $36.5\\text{ ms}$ | $-69.5\\%$ |
| **Memory Bandwidth** | $3.2\\text{ TB/s}$ | $6.8\\text{ TB/s}$ | $+112.5\\%$ |

### 3. Recommendations
* Deploy **speculative validation workers** for non-blocking state mutations.
* Implement structured schema validation at ingress boundaries to eliminate runtime reflection overhead.`,
    };
  }

  // Math, Equations, or Derivations
  if (
    promptLower.includes('math') ||
    promptLower.includes('equation') ||
    promptLower.includes('derive') ||
    promptLower.includes('quantum') ||
    promptLower.includes('proof') ||
    promptLower.includes('formula') ||
    promptLower.includes('integral')
  ) {
    return {
      reasoning: {
        thinkingTime: 3.5,
        steps: [
          'Deconstruct formal mathematical constraints and boundary conditions.',
          'Formulate continuous integration domain and variable substitutions.',
          'Verify step-by-step convergence properties and symmetry invariants.',
          'Format final theorem using standard KaTeX notation.',
        ],
        content: 'Constructing rigorous mathematical derivation with LaTeX equation rendering.',
      },
      content: `Here is the formal step-by-step mathematical derivation for your request:

### 1. Problem Formulation
Consider the generalized Gaussian integral over the entire real line:
$$I = \\int_{-\\infty}^{\\infty} e^{-a x^2} \\, dx \\quad (a > 0)$$

To evaluate $I$, we consider the squared double integral over $\\mathbb{R}^2$:
$$I^2 = \\left( \\int_{-\\infty}^{\\infty} e^{-a x^2} \\, dx \\right) \\left( \\int_{-\\infty}^{\\infty} e^{-a y^2} \\, dy \\right) = \\int_{-\\infty}^{\\infty} \\int_{-\\infty}^{\\infty} e^{-a (x^2 + y^2)} \\, dx \\, dy$$

---

### 2. Transformation to Polar Coordinates
Transforming coordinates where $x = r \\cos\\theta$, $y = r \\sin\\theta$, with Jacobian $dx \\, dy = r \\, dr \\, d\\theta$:
$$I^2 = \\int_{0}^{2\\pi} d\\theta \\int_{0}^{\\infty} r e^{-a r^2} \\, dr$$

The angular integral evaluates directly to $2\\pi$:
$$\\int_{0}^{2\\pi} d\\theta = 2\\pi$$

For the radial integral, substitute $u = a r^2 \\implies du = 2a r \\, dr$:
$$\\int_{0}^{\\infty} r e^{-a r^2} \\, dr = \\frac{1}{2a} \\int_{0}^{\\infty} e^{-u} \\, du = \\frac{1}{2a} \\left[ -e^{-u} \\right]_{0}^{\\infty} = \\frac{1}{2a}$$

---

### 3. Closed-Form Identity
Combining the results:
$$I^2 = 2\\pi \\cdot \\frac{1}{2a} = \\frac{\\pi}{a}$$

Taking the positive square root:
$$\\int_{-\\infty}^{\\infty} e^{-a x^2} \\, dx = \\sqrt{\\frac{\\pi}{a}}$$

For the standard normalized case where $a = 1$:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}$$`,
    };
  }

  // Coding or Systems Engineering
  if (
    promptLower.includes('code') ||
    promptLower.includes('typescript') ||
    promptLower.includes('python') ||
    promptLower.includes('function') ||
    promptLower.includes('api') ||
    promptLower.includes('class') ||
    promptLower.includes('bug') ||
    promptLower.includes('debug') ||
    promptLower.includes('component')
  ) {
    return {
      reasoning: {
        thinkingTime: 1.8,
        steps: [
          'Parse requirements for type safety, concurrency, and memory efficiency.',
          'Draft modular TypeScript interface and implementation.',
          'Incorporate defensive error boundaries and edge-case handling.',
        ],
        content: 'Formulating production-grade TypeScript code snippet with comprehensive typings.',
      },
      content: `Here is a high-performance, strongly typed implementation designed for production scalability:

\`\`\`typescript
export interface CacheOptions {
  maxSize: number;
  defaultTtlMs: number;
}

interface CacheNode<V> {
  key: string;
  value: V;
  expiresAt: number;
  prev: CacheNode<V> | null;
  next: CacheNode<V> | null;
}

/**
 * High-performance O(1) Least Recently Used (LRU) Cache with TTL support.
 */
export class HighThroughputLruCache<V> {
  private readonly map = new Map<string, CacheNode<V>>();
  private head: CacheNode<V> | null = null;
  private tail: CacheNode<V> | null = null;

  constructor(private readonly options: CacheOptions) {}

  public get(key: string): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;

    // Check expiration
    if (Date.now() > node.expiresAt) {
      this.evictNode(node);
      return undefined;
    }

    // Move to most recently used head
    this.moveToHead(node);
    return node.value;
  }

  public set(key: string, value: V, ttlMs = this.options.defaultTtlMs): void {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      existing.expiresAt = Date.now() + ttlMs;
      this.moveToHead(existing);
      return;
    }

    // Evict least recently used if capacity exceeded
    if (this.map.size >= this.options.maxSize && this.tail) {
      this.evictNode(this.tail);
    }

    const newNode: CacheNode<V> = {
      key,
      value,
      expiresAt: Date.now() + ttlMs,
      prev: null,
      next: this.head,
    };

    if (this.head) this.head.prev = newNode;
    this.head = newNode;
    if (!this.tail) this.tail = newNode;

    this.map.set(key, newNode);
  }

  private moveToHead(node: CacheNode<V>): void {
    if (node === this.head) return;
    this.detach(node);
    node.next = this.head;
    node.prev = null;
    if (this.head) this.head.prev = node;
    this.head = node;
  }

  private evictNode(node: CacheNode<V>): void {
    this.detach(node);
    this.map.delete(node.key);
  }

  private detach(node: CacheNode<V>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;
  }
}
\`\`\`

### Key Architectural Invariants:
1. **$O(1)$ Time Complexity**: Both lookup and eviction operate in constant time via doubly-linked list pointers.
2. **Lazy Eviction**: Expired keys are cleanly excised upon lookup, keeping CPU background churn minimal.
3. **Memory Bounded**: Hard cap prevents Node.js process out-of-memory crashes.`,
    };
  }

  // Default deep response
  return {
    reasoning: {
      thinkingTime: 1.6,
      steps: [
        'Analyze intent and synthesize nuanced multi-faceted response.',
        'Formulate actionable takeaways and structured explanations.',
      ],
      content: 'Synthesizing comprehensive response aligned with user guidelines.',
    },
    content: `Thank you for your prompt: **"${userPrompt}"**.

Here is an analysis and breakdown of the primary considerations:

### 1. Core Principles
* **Modularity**: Decouple state management from rendering pipelines to minimize blast radius and ensure unit testability.
* **Resilience**: Implement circuit breakers and graceful fallback strategies across all external dependencies.
* **Efficiency**: Optimize hot paths with zero-allocation buffers and vectorized operations.

### 2. Implementation Strategy
1. **Define Schema Contracts**: Establish unambiguous TypeScript types or Protocol Buffers before writing implementation code.
2. **Deterministic State Transitions**: Model side effects using predictable state machines rather than scattered boolean flags.
3. **Continuous Benchmarking**: Measure real P95 and P99 latency regressions in CI prior to deployment.

Let me know if you would like me to deep-dive into code examples, architectural diagrams, or formal proofs!`,
  };
}
