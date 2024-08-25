/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: ''
      },

      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: ''
      },
    ],
  },
};

export default nextConfig;
