import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const supabaseHostFromEnv = (() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return null;
  }
})();

const baseRemotePatterns: RemotePattern[] = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'toposcollective.com',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'maps.googleapis.com',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'bmeqohskvwucqklbbmdm.supabase.co',
    port: '',
    pathname: '/**',
  },
];

const supabaseRemotePatterns: RemotePattern[] = supabaseHostFromEnv
  ? [
      {
        protocol: 'https',
        hostname: supabaseHostFromEnv,
        port: '',
        pathname: '/**',
      },
    ]
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [...baseRemotePatterns, ...supabaseRemotePatterns],
  },
};

export default nextConfig;
