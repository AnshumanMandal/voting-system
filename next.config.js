/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false
    };
    return config;
  }
}

module.exports = nextConfig