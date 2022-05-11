const logger = require("./logger").setup();

const yaml = require("js-yaml");
const fs   = require("fs");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env.production" });

try {
    const secrets = yaml.dump(
        {
            apiVersion: "v1",
            kind: "Secret",
            metadata: {
                name: "boop-secrets"
            },
            stringData: {
                GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
                GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
                TOKEN_SECRET: process.env.TOKEN_SECRET,

                DB_NAME: process.env.DB_NAME,
                DB_USERNAME: process.env.DB_USERNAME,
                DB_PASSWORD: process.env.DB_PASSWORD,
                DB_HOST: process.env.DB_HOST,
                DB_PORT: process.env.DB_PORT,
            }
        }
    );

    fs.writeFile("../boop-secret.yaml", secrets, function (err) {
        if (err) throw err;
        logger.info("Secret file was created successfully.");
    });
} catch (e) {
    logger.error(`while trying to create boop-secret.yaml: ${e}`);
}