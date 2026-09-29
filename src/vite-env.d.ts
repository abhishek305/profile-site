/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The project defines no environment variables; this interface exists for the Vite types. */
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
