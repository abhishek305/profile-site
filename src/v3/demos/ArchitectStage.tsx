import { useMemo, useState } from "react";
import { buildBacklog, SAMPLE_SPECS, type SpecKey } from "./logic/backlog";
import { useCopyAction } from "../hooks/useCopyAction";
import { Stage } from "../components/layout/Stage";
import { Chips } from "../components/ui/Chips";

type View = "backlog" | "csv";

const TRUNCATE_AT = 96;

export const ArchitectStage = ({
  disclaimer = "Rule-based stand-in for illustration. The real toolkit uses LLM agents.",
}: {
  disclaimer?: string;
}) => {
  const [preset, setPreset] = useState<SpecKey>("notify");
  const [spec, setSpec] = useState(SAMPLE_SPECS.notify);
  const [view, setView] = useState<View>("backlog");
  const result = useMemo(() => buildBacklog(spec), [spec]);
  const { copy: copyCsv } = useCopyAction(result.csv, "CSV copied");

  const selectPreset = (next: SpecKey) => {
    setPreset(next);
    setSpec(SAMPLE_SPECS[next]);
  };

  return (
    <Stage
      hint="Try it: edit the spec"
      disclaimer={disclaimer}
      fallback="This demo needs JavaScript. It turns each sentence of a spec into a prioritised ticket and a CSV row."
      actions={
        <>
          <Chips
            label="Sample specs"
            value={preset}
            onChange={selectPreset}
            options={[
              { value: "notify", label: "Notifications" },
              { value: "checkout", label: "Checkout" },
            ]}
          />
          <button className="btn small" type="button" onClick={() => selectPreset(preset)}>
            Reset
          </button>
        </>
      }
    >
      <div className="split">
        <div className="pane">
          <label className="fl" htmlFor="architect-spec">
            Spec
          </label>
          <textarea
            id="architect-spec"
            spellCheck={false}
            value={spec}
            onChange={(event) => setSpec(event.target.value)}
          />
        </div>
        <div className="pane">
          <div className="pane-h">
            <h3 id="architect-result-heading">Result</h3>
            <Chips
              label="Result view"
              value={view}
              onChange={setView}
              options={[
                { value: "backlog", label: "Backlog" },
                { value: "csv", label: "CSV" },
              ]}
            />
          </div>

          {/*
            Each panel is a labelled region rather than a tab: the two views are
            not peers in a single widget, and hiding one with `hidden` keeps it
            out of the accessibility tree and the tab order.
          */}
          <div role="region" aria-labelledby="architect-result-heading" hidden={view !== "backlog"}>
            <ol className="tickets">
              {result.items.length ? (
                result.items.map((item, index) => (
                  <li key={`${item.text}-${index}`}>
                    <div className="meta">
                      <span className={`badge ${item.priority === "Must" ? "p1" : item.priority === "No priority" ? "p0" : ""}`}>
                        {item.priority}
                      </span>
                      <span>
                        {item.points} {item.points === 1 ? "point" : "points"}
                      </span>
                      {item.labels.map((label) => (
                        <span className="tag" key={label}>
                          {label}
                        </span>
                      ))}
                    </div>
                    <p className="t">
                      {item.text.length > TRUNCATE_AT
                        ? `${item.text.slice(0, TRUNCATE_AT - 3).replace(/\s+\S*$/, "")}...`
                        : item.text}
                    </p>
                  </li>
                ))
              ) : (
                <li className="empty">Write a sentence that ends with a full stop to create a ticket.</li>
              )}
            </ol>
            {/* The count and point total change on every keystroke, so this is
                the one polite region for the panel rather than the whole list. */}
            <p className="summary" role="status" aria-live="polite">
              {result.summary}
            </p>
          </div>

          <div hidden={view !== "csv"}>
            {/*
              The CSV can overflow its box, so it is focusable to satisfy
              WCAG 2.1.1: a keyboard user must be able to scroll it.
            */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <pre className="msg" tabIndex={0} aria-label="CSV preview">
              {result.csv}
            </pre>
            <button className="btn small" type="button" onClick={copyCsv}>
              Copy CSV
            </button>
          </div>
        </div>
      </div>
    </Stage>
  );
};
