'use strict';

const fs = require("fs");
const path = require("path");
const readFile = require("util").promisify(fs.readFile);

module.exports = {
    up: async (queryInterface) => {
        try {
            const queryPath = path.resolve(
                __dirname,
                "../queries/create-tables.sql"
            );
            const query = await readFile(queryPath, "utf8");
            return await queryInterface.sequelize.query(query);
        } catch (err) {
            console.error("Unable to create tables: ", err);
        }
    },
    down: async (queryInterface) => {
        try {
            const queryPath = path.resolve(__dirname, "../queries/drop-tables.sql");
            const query = await readFile(queryPath, "utf8");
            return await queryInterface.sequelize.query(query);
        } catch (err) {
            console.error("Unable to drop tables: ", err);
        }
    },
};
