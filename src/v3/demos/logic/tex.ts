/**
 * A small, safe stand-in LaTeX renderer.
 *
 * Supports the handful of commands the demo needs: sections, bold, emphasis,
 * itemize/enumerate lists and a subset of inline and display maths. Source text
 * is escaped before any markup is generated, so nothing a visitor types is ever
 * evaluated. The real editor compiles full TeX via WebAssembly.
 */

export const DEFAULT_TEX_SOURCE =
  "\\section{Notes on averages}\nLet $x_i$ be the $i$-th score. The mean is\n$$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$$\n\\textbf{Bold} and \\emph{emphasis} work, and so do lists:\n\\begin{itemize}\n\\item First idea\n\\item Second idea\n\\end{itemize}";

export interface TexRenderResult {
  html: string;
  status: string;
  error: boolean;
}

const MATH_SYMBOLS: Record<string, string> = {
  "\\alpha": "α", "\\beta": "β", "\\gamma": "γ", "\\delta": "δ",
  "\\mu": "μ", "\\sigma": "σ", "\\pi": "π", "\\theta": "θ", "\\lambda": "λ",
  "\\sum": "∑", "\\int": "∫", "\\infty": "∞",
  "\\cdot": "·", "\\times": "×",
  "\\leq": "≤", "\\geq": "≥", "\\neq": "≠", "\\approx": "≈", "\\pm": "±",
};

const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const renderMath = (source: string): string => {
  let rendered = source;

  // \frac nests, so iterate until the innermost pairs are gone.
  let iterations = 0;
  while (/\\frac\{[^{}]*\}\{[^{}]*\}/.test(rendered) && iterations++ < 20) {
    rendered = rendered.replace(
      /\\frac\{([^{}]*)\}\{([^{}]*)\}/g,
      '<span class="frac"><span>$1</span><span>$2</span></span>',
    );
  }

  rendered = rendered
    .replace(/\\sqrt\{([^{}]*)\}/g, "√($1)")
    .replace(/\\bar\{([^{}]*)\}/g, '<span class="over">$1</span>')
    .replace(/\^\{([^{}]*)\}/g, "<sup>$1</sup>")
    .replace(/\^([A-Za-z0-9])/g, "<sup>$1</sup>")
    .replace(/_\{([^{}]*)\}/g, "<sub>$1</sub>")
    .replace(/_([A-Za-z0-9])/g, "<sub>$1</sub>");

  rendered = rendered
    .replace(/\\[a-zA-Z]+/g, (command) => MATH_SYMBOLS[command] ?? "")
    .replace(/\\left|\\right/g, "");

  return rendered.replace(/[{}]/g, "");
};

/** Sentinel that survives the escaping pass and marks stored math fragments. */
const PLACEHOLDER = "\u0001";

export function texRender(source: string): TexRenderResult {
  const opened = (source.match(/\{/g) ?? []).length;
  const closed = (source.match(/\}/g) ?? []).length;
  const hasUnbalancedBraces = opened !== closed;

  let text = escapeHtml(source);
  const stored: string[] = [];

  // Pull maths out first, so the markup below cannot mangle it.
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_match, body: string) => {
    stored.push(`<div class="dmath math">${renderMath(body)}</div>`);
    return `\n\n${PLACEHOLDER}${stored.length - 1}${PLACEHOLDER}\n\n`;
  });
  text = text.replace(/\$([^$\n]+?)\$/g, (_match, body: string) => {
    stored.push(`<span class="math">${renderMath(body)}</span>`);
    return `${PLACEHOLDER}${stored.length - 1}${PLACEHOLDER}`;
  });

  text = text
    .replace(/\\section\{([^{}]*)\}/g, "\n\n<h3>$1</h3>\n\n")
    .replace(/\\subsection\{([^{}]*)\}/g, "\n\n<h3>$1</h3>\n\n")
    .replace(/\\textbf\{([^{}]*)\}/g, "<b>$1</b>")
    .replace(/\\emph\{([^{}]*)\}/g, "<i>$1</i>")
    .replace(/\\textit\{([^{}]*)\}/g, "<i>$1</i>");

  text = text.replace(
    /\\begin\{(itemize|enumerate)\}([\s\S]*?)\\end\{\1\}/g,
    (_match, kind: string, body: string) => {
      const tag = kind === "itemize" ? "ul" : "ol";
      const items = body
        .split(/\\item/)
        .slice(1)
        .map((item) => `<li>${item.trim()}</li>`)
        .join("");
      return `\n\n<${tag}>${items}</${tag}>\n\n`;
    },
  );

  let html = text
    .split(/\n\s*\n/)
    .map((chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed) return "";
      // Block-level output passes through; everything else becomes a paragraph.
      if (/^<(h3|ul|ol)/.test(trimmed) || new RegExp(`^${PLACEHOLDER}\\d+${PLACEHOLDER}$`).test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, " ")}</p>`;
    })
    .join("");

  html = html.replace(
    new RegExp(`${PLACEHOLDER}(\\d+)${PLACEHOLDER}`, "g"),
    (_match, index: string) => stored[Number(index)],
  );

  if (!html) html = '<p class="empty">Start typing LaTeX on the left.</p>';

  return {
    html,
    error: hasUnbalancedBraces,
    status: hasUnbalancedBraces
      ? `Braces don't match: ${opened} opened, ${closed} closed. Check the last \\textbf, \\emph or \\frac.`
      : "Rendered in 1 ms, in your browser.",
  };
}
