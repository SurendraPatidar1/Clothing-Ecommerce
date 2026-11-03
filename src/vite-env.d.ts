/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_YOUTUBE_URL?: string;
  readonly VITE_MAP_EMBED_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
