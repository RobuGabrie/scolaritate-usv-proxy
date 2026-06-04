import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow dev server access from local network devices (e.g. iPhone on same Wi-Fi).
  // Next.js uses glob matching, not CIDR — use 192.168.1.* not 192.168.1.0/24.
  allowedDevOrigins: ["192.168.1.*", "10.0.*.*"],
};

export default nextConfig;
