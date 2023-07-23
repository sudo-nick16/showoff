/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  esmExternals: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
