/**
 * Loads the TypeScript content and site modules from Node.
 *
 * `src/v3/content` and `src/v3/site` are the single source of truth for the
 * copy and the canonical URL. The prerenderer needs the same values, but it is
 * plain Node and cannot import TypeScript directly, so esbuild (already
 * present as a Vite dependency) bundles them to a temporary module that is
 * then imported normally.
 */
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

/** Bundles the given entry points and returns their combined exports. */
export const loadTypeScriptModules = async (entryPoints, { cwd = process.cwd() } = {}) => {
  const dir = await mkdtemp(join(tmpdir(), "prerender-"));
  const outfile = join(dir, "bundle.mjs");

  try {
    await build({
      entryPoints: entryPoints.map((entry) => join(cwd, entry)),
      outfile,
      bundle: true,
      format: "esm",
      platform: "node",
      target: `node${process.versions.node.split(".")[0]}`,
      logLevel: "silent",
    });

    return await import(pathToFileURL(outfile).href);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

/** Reads and parses a JSON file. */
export const readJson = async (path, { cwd = process.cwd() } = {}) =>
  JSON.parse(await readFile(join(cwd, path), "utf8"));

/** Writes a file, creating parent directories as needed. */
export const writeFileEnsured = async (path, contents, { cwd = process.cwd() } = {}) => {
  const target = join(cwd, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
};
