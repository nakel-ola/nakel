/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SANITY_TOKEN: process.env.SANITY_TOKEN,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
  },
};

module.exports = nextConfig;
