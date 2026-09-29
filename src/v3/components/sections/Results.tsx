import { Receipts } from "../ui/Receipts";
import { Section } from "../common/Section";
import { EMPLOYMENT, resultClaims } from "../../content";

/** The six measured outcomes. Each row expands to explain what changed. */
export const Results = () => (
  <Section id="results" title="Results">
    <div className="prose">
      <p>
        Six measurable outcomes from my time at {EMPLOYMENT.company}. Open a row to see what changed.
      </p>
    </div>
    <Receipts items={resultClaims} />
  </Section>
);
