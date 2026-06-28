/** @type {import('next').NextConfig} */
const nextConfig = {
  // ビルド時にESLintエラーでコケないよう（型チェックは tsc が担う）
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScriptエラーもビルドを止めない（型チェック済みのため）
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
