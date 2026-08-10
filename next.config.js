const isGithubActions = process.env.GITHUB_ACTIONS || false;
let repo = '';

if (isGithubActions) {
  const repository = process.env.GITHUB_REPOSITORY || '';
  repo = repository.split('/')[1] || '';
}

let basePath = process.env.NEXT_PUBLIC_BASE_PATH || (repo ? `/${repo}` : '');
if (basePath === '/') basePath = '';

const assetPrefix = basePath ? `${basePath}/` : undefined;

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === 'development',
  basePath: basePath || undefined,
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: assetPrefix,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
