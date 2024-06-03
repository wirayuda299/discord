/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    SERVER_URL: process.env.SERVER_URL,
    LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com',
        pathname: '/**/*',
        port: '',
        protocol: 'https',
      },
      {
        hostname: 'img.clerk.com',
        pathname: '/*',
        port: '',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
