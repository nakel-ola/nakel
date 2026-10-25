/** Tool names (as written in Sanity and the case studies) → logo files in /public/logos. */
const SLUGS: Record<string, string> = {
  rust: "rust",
  tauri: "tauri",
  react: "react",
  reactjs: "react",
  reactnative: "react",
  typescript: "typescript",
  javascript: "javascript",
  postgres: "postgresql",
  postgresql: "postgresql",
  onnx: "onnx",
  onnxruntime: "onnx",
  stripe: "stripe",
  cloudflare: "cloudflare",
  cloudflarer2: "cloudflare",
  r2: "cloudflare",
  cloudflareworkers: "cloudflare-workers",
  workers: "cloudflare-workers",
  swift: "swift",
  nestjs: "nestjs",
  sqlite: "sqlite",
  mcp: "model-context-protocol",
  expo: "expo",
  supabase: "supabase",
  vite: "vite",
  next: "nextjs",
  nextjs: "nextjs",
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  mongodb: "mongodb",
  graphql: "graphql",
  firebase: "firebase",
  redux: "redux",
  sass: "sass",
  html5: "html5",
  css3: "css3",
  node: "nodejs",
  nodejs: "nodejs",
  git: "git",
  electron: "electron",
  flutter: "flutter",
  mui: "mui",
  anthropic: "anthropic",
  deno: "deno",
  playwright: "playwright",
  docker: "docker",
};

/** "Tauri 2", "React 19", "Cloudflare R2" → a local logo path, or undefined. */
export const logoFor = (name: string) => {
  const key = name
    .toLowerCase()
    .replace(/\s+\d+(\.\d+)?$/, "") // drop version suffixes
    .replace(/[^a-z0-9]/g, "");
  const slug = SLUGS[key];
  return slug ? `/logos/${slug}.svg` : undefined;
};
