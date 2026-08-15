import type { NextConfig } from "next";

/**
 * This app is a CHILD zone of the stevetech multi-zone platform: the browser
 * only ever talks to the host (stevetech.co.za / localhost:3000), which
 * rewrites /timer and /timer-static here.
 *
 * - basePath makes every route and internal link render as /timer/...
 * - assetPrefix keeps this zone's static chunks on a path the host proxies
 *   separately, so they never collide with the host's own /_next assets.
 */
const nextConfig: NextConfig = {
  basePath: "/timer",
  assetPrefix: "/timer-static",
};

export default nextConfig;
