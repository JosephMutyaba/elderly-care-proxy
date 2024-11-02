import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next.config.js

};

export default nextConfig;


module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*', // Protect all admin routes
        destination: '/:path*',
      },
      {
        source: '/login', // Login page redirect
        destination: '/login',
      },
      {
        source: '/register', // Register page redirect
        destination: '/register',
      },
    ];
  },
};
