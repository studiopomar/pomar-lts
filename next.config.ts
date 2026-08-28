import type { NextConfig } from 'next';

const repository = 'pomar-lts';
const basePath = process.env.GITHUB_ACTIONS ? `/${repository}` : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
