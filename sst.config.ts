/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "entipedia-mvp",
      removal: input?.stage === "production" ? "retain" : "remove",
      // protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },

  async run() {
    // SSM Secrets
    const DbUser = new sst.Secret("DB_USER");
    const DbPassword = new sst.Secret("DB_PASSWORD");

    // RDS instance
    // const db = new sst.aws.RDS("Database", {
    //   engine: "postgresql11.16",
    //   defaultDatabaseName: "entipedia",
    //   credentials: {
    //     username: DbUser,
    //     password: DbPassword,
    //   },
    // });

    const vpc = new sst.aws.Vpc("MyVpc");
    const db = new sst.aws.Postgres("MyPostgres", {
      vpc,
      dev: {
        username: DbUser.value,
        password: DbPassword.value,
        database: "entipedia",
        port: 5432,
      },
    });

    // Bucket
    const bucket = new sst.aws.Bucket("UploadsBucket");

    // Next.js app
    const web = new sst.aws.Nextjs("MyWeb", {
      link: [db, bucket, DbUser, DbPassword],
    });

    return {
      WebUrl: web.url,
      BucketName: bucket.name,
    };
  },
});
