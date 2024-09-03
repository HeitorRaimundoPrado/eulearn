/** @type {import('next').NextConfig} */

let rp = [
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '8000',
    pathname: '*'
  },
  {
    protocol: 'http',
    hostname: 'localhost',
    port: '9000',
    pathname: '*'
  },
]

if (process.env.NODE_ENV === 'production') {
  rp = [
    {
      protocol: process.env.REMOTE_IMAGE_PROTOCOL,
      hostname: process.env.REMOTE_IMAGE_HOSTNAME,
      port: process.env.REMOTE_IMAGE_PORT,
      pathname: process.env.REMOTE_IMAGE_PATHNAME
    }
  ]
}

const nextConfig = {
  images: {
    remotePatterns: [
    ],
  },
};

export default nextConfig;
