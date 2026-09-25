import { lazy, Suspense, useEffect, useRef, useState } from "react";
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
    <div className="stage-bar"><span className="hint">{label}</span></div>
    <p className="disclaimer">The interactive stage loads as it approaches the viewport. The chapter text above is available without it.</p>
  </div>
);

/**
 * Keeps the demo implementation out of the initial route bundle and defers the
 * chunk until the stage is close to the viewport. The wrapper reserves a small
 * amount of space to avoid a large layout jump when the stage mounts.
 */
export const LazyStage = ({ kind, disclaimer, eager = false }: { kind: DemoKind; disclaimer?: string; eager?: boolean }) => {
  const slotRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (eager) {
      setShouldLoad(true);
      return;
    }
    const slot = slotRef.current;
    if (!slot || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: "420px 0px" });
    observer.observe(slot);

    const revealWhenNear = () => {
      const rect = slot.getBoundingClientRect();
      if (rect.top < window.innerHeight + 420 && rect.bottom > -420) {
        setShouldLoad(true);
        observer.disconnect();
        window.removeEventListener("scroll", revealWhenNear);
        window.removeEventListener("resize", revealWhenNear);
      }
    };
    revealWhenNear();
    window.addEventListener("scroll", revealWhenNear, { passive: true });
    window.addEventListener("resize", revealWhenNear);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealWhenNear);
      window.removeEventListener("resize", revealWhenNear);
    };
  }, [eager]);

  const StageComponent = stageComponents[kind];
  return (
    <div ref={slotRef} className="stage-lazy-slot">
      {shouldLoad
        ? <Suspense fallback={<StageLoading />}><StageComponent disclaimer={disclaimer} /></Suspense>
        : <StageLoading label="Stage loads as you approach it" />}
    </div>
  );
};
