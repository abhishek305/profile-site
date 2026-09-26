import { lazy, Suspense } from "react";
import { useInView } from "../hooks/useInView";
import type { DemoKind } from "../types";

const McpStage = lazy(() => import("./DemoStages").then((module) => ({ default: module.McpStage })));
const ArchitectStage = lazy(() => import("./DemoStages").then((module) => ({ default: module.ArchitectStage })));
const CrowdlyStage = lazy(() => import("./DemoStages").then((module) => ({ default: module.CrowdlyStage })));
const LatexStage = lazy(() => import("./DemoStages").then((module) => ({ default: module.LatexStage })));

const stageComponents = {
  mcp: McpStage,
  architect: ArchitectStage,
  crowdly: CrowdlyStage,
  latex: LatexStage,
} as const;

const StageLoading = ({ label = "Loading the interactive stage" }: { label?: string }) => (
  <div className="stage stage-loading seen" aria-busy="true">
    <div className="stage-bar">
      <span className="hint">{label}</span>
    </div>
    <p className="disclaimer">
      The interactive stage loads as it approaches the viewport. The chapter text above is available without
      it.
    </p>
  </div>
);

/**
 * Keeps the demo implementation out of the initial route bundle and defers the
 * chunk until the stage is close to the viewport. The wrapper reserves a small
 * amount of space to avoid a large layout jump when the stage mounts.
 */
export const LazyStage = ({
  kind,
  disclaimer,
  eager = false,
}: {
  kind: DemoKind;
  disclaimer?: string;
  eager?: boolean;
}) => {
  // `eager` skips the viewport check entirely: standalone chapter routes are the
  // whole point of the page, so the stage should load straight away.
  const { ref: slotRef, inView } = useInView<HTMLDivElement>({ rootMargin: "420px 0px" });
  const shouldLoad = eager || inView;

  const StageComponent = stageComponents[kind];
  return (
    <div ref={slotRef} className="stage-lazy-slot">
      {shouldLoad ? (
        <Suspense fallback={<StageLoading />}>
          <StageComponent disclaimer={disclaimer} />
        </Suspense>
      ) : (
        <StageLoading label="Stage loads as you approach it" />
      )}
    </div>
  );
};
