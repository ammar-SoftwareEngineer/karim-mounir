import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
    webpackBuildWorker: false,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 1000,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.karimmounir.com",
        pathname: "/**",
      },
    ],
  },
};
export default withNextIntl(nextConfig);