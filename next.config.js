/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/index.html", destination: "/" },
      { source: "/admin.html", destination: "/admin" }
    ];
  }
};

module.exports = nextConfig;
