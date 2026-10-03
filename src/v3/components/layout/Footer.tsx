import { identity, links } from "../../site";

const FOOTER_NAV = [
  { href: "/#mcp", label: "Demos" },
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/code", label: "Code" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/resume", label: "Résumé" },
] as const;

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="v3-footer">
      <div className="foot-in">
        <div className="foot-top">
          <a className="foot-brand" href="/" aria-label={`${identity.name} — home`}>
            {identity.name}
          </a>

          <nav className="foot-nav" aria-label="Footer">
            {FOOTER_NAV.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <p className="foot-links">
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              GitHub<span className="vh"> (opens in a new tab)</span>
            </a>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn<span className="vh"> (opens in a new tab)</span>
            </a>
            <a href={links.email}>Email</a>
            <a href="#main">Back to top</a>
          </p>
        </div>

        <p className="foot-base">
          <span>© {year} {identity.name}. All rights reserved.</span>
          <span>Last updated September 21, 2026.</span>
          <span>Design prototype: demos use stand-in logic and fictional data.</span>
        </p>
      </div>
    </footer>
  );
};
