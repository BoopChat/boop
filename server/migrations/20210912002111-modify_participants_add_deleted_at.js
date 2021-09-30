"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            return Promise.all([
                queryInterface.addColumn(
                    "Participants", // table name
                    "deleted_at", // new field name
                    { type: Sequelize.DATE, field: "deleted_at" },
                ),
            ]);
        } catch (err) {
            console.error("Unable to update Participant table: ", err);
        }

    },

    down: async (queryInterface) => {
        // logic for reverting the change
        return Promise.all([
            queryInterface.removeColumn("Participants", "deleted_at"),
        ]);
    }
};
