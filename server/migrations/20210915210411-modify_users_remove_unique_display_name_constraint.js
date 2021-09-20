"use strict";

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.removeConstraint(
            "Users",
            "Users_display_name_key"
        );
    },

    down: async (queryInterface) => {
        await queryInterface.addConstraint("Users", {
            fields: ["display_name"],
            type: "unique",
            name: "Users_display_name_key",
        });
    }
};
