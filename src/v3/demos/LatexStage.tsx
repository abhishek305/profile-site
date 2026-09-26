import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_TEX_SOURCE, texRender } from "./logic/tex";
import { Stage } from "../components/layout/Stage";

/** Long enough that a fast typist does not queue an announcement per keystroke. */
const ANNOUNCE_DEBOUNCE_MS = 600;

export const LatexStage = ({
  disclaimer = "Stand-in renderer for the design prototype. Supports sections, bold, emphasis, lists and basic maths.",
}: {
  disclaimer?: string;
}) => {
  const [source, setSource] = useState(DEFAULT_TEX_SOURCE);
  const result = useMemo(() => texRender(source), [source]);

  return (
    <Stage
      hint="Try it: type some LaTeX"
      disclaimer={disclaimer}
      fallback="This demo needs JavaScript. It renders a small subset of LaTeX as you type."
      actions={
        <button className="btn small" type="button" onClick={() => setSource(DEFAULT_TEX_SOURCE)}>
          Reset
        </button>
      }
    >
      <div className="split">
        <div className="pane">
          <label className="fl" htmlFor="tex-source">
            Source
          </label>
          <textarea
            id="tex-source"
            spellCheck={false}
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />
          {/*
            The visible status updates on every keystroke, which is right, but
            announcing it that often is not. The visible line is aria-hidden and
            a debounced mirror of the error state is what gets announced.
          */}
          <p className={`status ${result.error ? "err" : "ok"}`} aria-hidden="true">
            {result.status}
          </p>
          <TexStatusAnnouncer status={result.status} />
        </div>
        <div className="pane">
          <h3>Page</h3>
          <div
            className="preview"
            // The renderer escapes all visitor input before generating markup,
            // and only ever emits the tags it builds itself.
            dangerouslySetInnerHTML={{ __html: result.html }}
          />
        </div>
      </div>
    </Stage>
  );
};

/** Announces only when the error state changes, not on every character. */
const TexStatusAnnouncer = ({ status }: { status: string }) => {
  const [announcement, setAnnouncement] = useState("");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = setTimeout(() => setAnnouncement(status), ANNOUNCE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <p className="vh" role="status" aria-live="polite">
      {announcement}
    </p>
  );
};
