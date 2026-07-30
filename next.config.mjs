/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/pnx_teamhub" : "",
  assetPrefix: isGitHubPages ? "/pnx_teamhub/" : "",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
