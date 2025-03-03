/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "krish-test-sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          profile: "cloudify-experimental-admin",
        },
      },
    };
  },
  async run() {
    const table = new sst.aws.Dynamo("new-table", {
      fields: {
        id: "string",
      },
      primaryIndex: { hashKey: "id" },
    });

    new sst.aws.Function("MyFunction", {
      handler: "src/app.handler",
      url: true,
      link: [table],
    });
  },
});
