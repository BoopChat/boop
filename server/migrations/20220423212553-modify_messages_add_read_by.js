"use strict";

module.exports = {
    async up (queryInterface, Sequelize) {
        try {
            return Promise.all([
                queryInterface.addColumn(
                    "Messages", // table name
                    "read_by", // new field name
                    { type: Sequelize.ARRAY(Sequelize.INTEGER), field: "read_by", defaultValue: [] },
                ),
            ]);
        } catch (err) {
            console.error("Unable to update Messages table: ", err);
        }
    },

    async down (queryInterface) {
        // logic for reverting the change
        return Promise.all([
            queryInterface.removeColumn("Messages", "read_by"),
        ]);
    }
};
