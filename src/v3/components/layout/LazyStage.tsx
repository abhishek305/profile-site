import { Suspense } from "react";
import { useInView } from "../../hooks/useInView";
import { stages } from "../../demos/registry";
import type { DemoKind } from "../../types";

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
 * Defers the demo chunk until the stage is near the viewport, keeping the demo
 * implementations out of the initial route bundle.
 *
 * @param eager standalone chapter routes are the whole point of the page, so
 *   they skip the viewport check and load immediately.
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
  const { ref: slotRef, inView } = useInView<HTMLDivElement>({ rootMargin: "420px 0px" });
  const shouldLoad = eager || inView;
  const Stage = stages[kind];

  return (
    <div ref={slotRef} className="stage-lazy-slot">
      {shouldLoad ? (
        <Suspense fallback={<StageLoading />}>
          <Stage disclaimer={disclaimer} />
        </Suspense>
      ) : (
        <StageLoading label="Stage loads as you approach it" />
      )}
    </div>
  );
};
