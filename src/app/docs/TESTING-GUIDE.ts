/**
 * @file: TESTING-GUIDE.ts
 * @description: YYC3 Testing Guide — navigable in-code documentation
 * @author: YanYuCloudCube Team
 * @version: v1.1.0
 * @created: 2026-04-08
 * @updated: 2026-04-19
 * @status: active
 * @tags: [docs]
 */

// ═══════════════════════════════════════════════════════════════
//  1. Test Infrastructure
// ═══════════════════════════════════════════════════════════════

/**
 * Framework: Vitest 4.x (vitest.config.ts at project root)
 *
 * Environment: jsdom (all tests)
 *   - Simulates browser DOM for React component testing
 *   - IndexedDB polyfilled via fake-indexeddb/auto
 *
 * Setup file: src/app/__tests__/setup.ts
 *   - Imports @testing-library/jest-dom/vitest matchers (toBeVisible, toHaveTextContent, etc.)
 *   - Mocks: ResizeObserver, IntersectionObserver, matchMedia, scrollTo, scrollIntoView
 *   - Mocks: navigator.clipboard (writeText/readText)
 *   - Mocks: localStorage + sessionStorage (in-memory implementations)
 *   - Polyfills: fake-indexeddb for IndexedDB in jsdom
 *
 * Test file pattern: src/app/__tests__/ (all .test.ts and .test.tsx files)
 * Test timeout: 10 000 ms
 */

// ═══════════════════════════════════════════════════════════════
//  2. Commands
// ═══════════════════════════════════════════════════════════════

/**
 * Run all tests once:
 *   pnpm test            (alias: vitest --run)
 *
 * Run tests in watch mode:
 *   pnpm test:watch      (alias: vitest --watch)
 *
 * Generate coverage report:
 *   pnpm test:coverage   (alias: vitest --coverage)
 *
 * CI run (non-interactive):
 *   pnpm test:ci         (alias: vitest --run)
 *
 * E2E tests:
 *   pnpm test:e2e        (Playwright)
 *   pnpm test:e2e:ui     (Playwright interactive UI)
 *   pnpm test:e2e:headed (Playwright with browser visible)
 *   pnpm test:e2e:install (Install Playwright browsers)
 *
 * Test ID validation:
 *   pnpm check:testid    (verify data-testid naming conventions)
 *   pnpm fix:testid      (auto-fix test ID prefixes)
 *   pnpm fix:all-testids (batch fix all test IDs)
 */

// ═══════════════════════════════════════════════════════════════
//  3. Coverage Configuration
// ═══════════════════════════════════════════════════════════════

/**
 * Provider: v8
 * Reporters: text, text-summary, lcov, json-summary
 * Output directory: ./coverage
 *
 * Include paths:
 *   src/app/lib/ (all .ts)
 *   src/app/hooks/ (all .ts)
 *   src/app/components/ (all .tsx)
 *   src/app/types/ (all .ts)
 *
 * Exclude paths:
 *   src/app/components/ui/ (shadcn/ui primitives - externally maintained)
 *   src/app/components/figma/
 *   src/app/docs/
 *   src/app/__tests__/
 *
 * Thresholds (minimum required):
 *   Lines:       50%
 *   Functions:   35%
 *   Branches:    40%
 *   Statements:  45%
 *
 * reportOnFailure: true  (coverage report generated even when tests fail)
 */

// ═══════════════════════════════════════════════════════════════
//  4. Zustand Store Testing Pattern
// ═══════════════════════════════════════════════════════════════

/**
 * Direct state access — no need for hook wrappers in unit tests:
 *
 *   import { useNodeStore } from "@/app/store/node-slice";
 *
 *   // Read state
 *   const nodes = useNodeStore.getState().nodes;
 *
 *   // Write state
 *   useNodeStore.setState({ nodes: [...] });
 *
 *   // Reset in beforeEach
 *   beforeEach(() => {
 *     useNodeStore.setState({ nodes: [], selectedId: null });
 *   });
 *
 * Tips:
 *   - Avoid importing the full store if you only need one slice.
 *   - Test selectors by calling getState() and checking the returned subset.
 *   - For async actions, use vi.useFakeTimers() or await the thunk.
 */

// ═══════════════════════════════════════════════════════════════
//  5. Mock Patterns
// ═══════════════════════════════════════════════════════════════

/**
 * External dependencies — use vi.mock() at the top of the test file:
 *
 *   vi.mock("react-router-dom", () => ({
 *     useNavigate: () => vi.fn(),
 *     useParams: () => ({ id: "test-id" }),
 *   }));
 *
 * Zustand slices — use real implementations, reset via setState:
 *
 *   // Do NOT mock zustand stores; test with real state.
 *   // Only mock the underlying data sources (fetch, WebSocket).
 *
 * IndexedDB — fake-indexeddb is loaded globally in setup.ts.
 *   Tests can use real idbPut/idbGet calls without mocking.
 *
 * localStorage — in-memory mock provided by setup.ts:
 *   window.localStorage.setItem("key", "value") works in tests.
 *
 * Web APIs — mock in setup.ts or per-file:
 *
 *   vi.stubGlobal("fetch", vi.fn(() =>
 *     Promise.resolve(new Response(JSON.stringify({ data: [] })))
 *   ));
 */

// ═══════════════════════════════════════════════════════════════
//  6. E2E Testing (Playwright)
// ═══════════════════════════════════════════════════════════════

/**
 * Framework: Playwright
 * Config: playwright.config.ts (root) + src/app/__tests__/e2e/playwright.config.ts
 * Spec file: e2e/app.spec.ts
 *
 * Commands:
 *   pnpm test:e2e           Run all E2E tests headless
 *   pnpm test:e2e:headed    Run with visible browser
 *   pnpm test:e2e:ui        Interactive Playwright UI mode
 *   pnpm test:e2e:install   Install browser binaries
 *
 * Notes:
 *   - E2E tests operate against a running dev server.
 *   - Ensure `pnpm dev` is running before executing E2E tests,
 *     or configure webServer in playwright.config.ts for auto-start.
 */

// ═══════════════════════════════════════════════════════════════
//  7. Test ID Naming Convention
// ═══════════════════════════════════════════════════════════════

/**
 * All data-testid attributes must follow the pattern:
 *   <category>-<component>-<element>
 *
 * Examples:
 *   data-testid="dashboard-glasscard-title"
 *   data-testid="sidebar-nav-item"
 *   data-testid="family-chat-input"
 *   data-testid="ide-terminal-container"
 *
 * Validation: pnpm check:testid
 * Auto-fix:   pnpm fix:testid
 */

// This file is navigable documentation only — no runtime exports.
export {};
