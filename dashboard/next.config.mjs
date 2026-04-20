/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ensuring the dashboard can communicate with our FastAPI backend
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8000/api/:path*',
          },
        ];
    },
};

export default nextConfig;
