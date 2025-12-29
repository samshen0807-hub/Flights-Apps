import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // cacheComponents: true, // Disabled to allow dynamic routes
};

export default withNextIntl(nextConfig);
