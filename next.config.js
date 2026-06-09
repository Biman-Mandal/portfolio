/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deploy a self‑contained bundle – works perfectly on Vercel
  output: 'export',
  // Enable React strict mode (optional but recommended)
  reactStrictMode: true,
  // If you use any env vars locally, Vercel will read them from the dashboard
  // No special rewrites needed for the app router
};

module.exports = nextConfig;
