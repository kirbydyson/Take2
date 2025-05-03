/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/temp_bucket_for_db/**',
            },
        ],
    },
};

export default nextConfig;
