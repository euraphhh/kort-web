import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Só no build da imagem Docker; a Vercel usa a saída própria dela.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
