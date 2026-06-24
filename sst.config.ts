/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "ttm-front",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const web = await import("./apps/web/sst");

    return {
      TTMWeb: web.TTMWeb.url,
    };
  },
});
