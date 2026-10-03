import { DefinitionList } from "../common/DefinitionList";
import { PageHead } from "../common/PageHead";
import { ExternalLink } from "../common/ExternalLink";
import {
  EMPLOYMENT,
  aboutDefinitions,
  experience,
  experienceIntro,
  resumeContact,
  resumeHighlights,
  resumeName,
  resumeSummary,
  resumeTitle,
} from "../../content/resume";

/** The file added to public/. */
const PDF_PATH = "/resume.pdf";

/**
 * The résumé page.
 *
 * Three ways to get the document, in the order a visitor is most likely to want
 * them: read it on the page, open the PDF in place, or take the file away. The
 * HTML version is first because it reflows for a phone, follows the theme and
 * needs no plugin, and because it is the copy search engines can read.
 *
 * The inline viewer is a native `<details>` disclosure, so it opens without
 * JavaScript and is keyboard reachable. `<object>` is preferred over `<iframe>`
 * because anything between its open and close tags is the fallback shown by
 * browsers that will not render a PDF inline.
 */
export const Resume = () => (
  <>
    <PageHead id="resume" title={resumeName} tagline={resumeTitle} />

    <div className="contact-links resume-actions">
      <a className="btn primary" href={PDF_PATH} download="Abhishek-Ezhava-resume.pdf">
        Download PDF
      </a>
      <ExternalLink className="btn" href={PDF_PATH}>
        Open in a new tab
      </ExternalLink>
      <button className="btn" type="button" onClick={() => window.print()}>
        Print this page
      </button>
    </div>

    <details className="pdf-viewer">
      <summary>View the PDF here</summary>
      <object data={PDF_PATH} type="application/pdf" aria-label={`${resumeName} résumé, PDF`}>
        {/* Shown only where the browser will not render a PDF inline. */}
        <p>
          Your browser will not display the PDF here.{" "}
          <a href={PDF_PATH} download="Abhishek-Ezhava-resume.pdf">
            Download it instead
          </a>
          , or read the full résumé below.
        </p>
      </object>
    </details>

    <article className="chapter resume">
      <div className="prose">
        <h2>Summary</h2>
        {resumeSummary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <ul className="resume-contact">
        {resumeContact.map((item) =>
          item.href.startsWith("mailto:") ? (
            <li key={item.label}>
              <b>{item.label}</b>
              <a href={item.href}>{item.value}</a>
            </li>
          ) : (
            <li key={item.label}>
              <b>{item.label}</b>
              <ExternalLink href={item.href}>{item.value}</ExternalLink>
            </li>
          ),
        )}
      </ul>

      <h2>Experience</h2>
      <p className="resume-note">
        {EMPLOYMENT.company}, {EMPLOYMENT.from} to {EMPLOYMENT.to}. {experienceIntro}
      </p>
      <ol className="roles">
        {experience.map((role) => (
          <li key={role.title}>
            <div className="role-h">
              <h3>{role.title}</h3>
              <span>{role.dates}</span>
            </div>
            <ul>
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <h2>Selected impact</h2>
      <ul className="resume-highlights">
        {resumeHighlights.map((claim) => (
          <li key={claim.value}>
            <b>{claim.value}</b>
            <span>{claim.explanation}</span>
          </li>
        ))}
      </ul>

      <h2>Skills, education and recognition</h2>
      <DefinitionList items={aboutDefinitions} />
    </article>
  </>
);
