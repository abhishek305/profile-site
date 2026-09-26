import { lazy } from "react";
import type { DemoKind } from "../types";

/**
 * Demo kind to its lazily-loaded stage.
 *
 * Kept apart from `index.tsx` so that module only exports components, which is
 * what lets the `react-refresh/only-export-components` rule stay enabled.
 */
export const stages = {
  mcp: lazy(() => import("./McpStage").then((module) => ({ default: module.McpStage }))),
  architect: lazy(() => import("./ArchitectStage").then((module) => ({ default: module.ArchitectStage }))),
  crowdly: lazy(() => import("./CrowdlyStage").then((module) => ({ default: module.CrowdlyStage }))),
  latex: lazy(() => import("./LatexStage").then((module) => ({ default: module.LatexStage }))),
} as const satisfies Record<DemoKind, unknown>;
