/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  // The site is published at the custom-domain root, so a repository
  // sub-path prefix would make the generated CSS and JS URLs 404.
  basePath: "",
  assetPrefix: "",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
