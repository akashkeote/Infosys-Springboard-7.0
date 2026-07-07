/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Firebase Hosting (Classic)
  output: "export",

  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },

  // Trailing slash for Firebase Hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
