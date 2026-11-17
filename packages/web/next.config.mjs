/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a second dev server run side by side without sharing (and corrupting) the .next cache.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
