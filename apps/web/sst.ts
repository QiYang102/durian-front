export const TTMWeb = new sst.aws.StaticSite("TTMWeb", {
  domain: {
    name: `chase.orderplan.app`,
    dns: sst.cloudflare.dns(),
  },
  build: {
    command: "cd ./apps/web && npm run build:prod",
    output: "./apps/web/dist",
  },
  environment: {
    NODE_ENV: "production",
    VITE_BACKEND_URL: `https://chase.orderplan.app/v1`,
  },
});
