"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        try {
            await queryInterface.addColumn(
                "Users", // table name
                "booptag", // new field name
                { type: Sequelize.STRING(32), field: "booptag" },
            );

        } catch (err) {
            console.error("Unable to update Users table: ", err);
        }
    },

    async down (queryInterface) {
        // logic for reverting the change
        try {
            return Promise.all([
                queryInterface.removeColumn("Users", "booptag")
            ]);
        } catch (err){
            console.error("Unable to update Users table: ", err);
        }
    }
};
