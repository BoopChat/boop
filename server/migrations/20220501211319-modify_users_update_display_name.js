"use strict";

const { Op } = require("sequelize");
const db = require("../models");
const User = db.User;

module.exports = {
    async up () {
        try {
            // get all existing users that have their email as their display name
            let users = await User.findAll({
                where: {
                    displayName: {
                        [Op.endsWith]: "@gmail.com"
                    }
                },
                // specify what attributes you want returned
                attributes: ["id", "displayName"],
            });

            // update all the users that had their email as their display name w/ a new display name
            for (const user of users) {
                await User.update(
                    {
                        displayName: `Booper${Math.floor(Math.random() * 100000)}`
                    },
                    {
                        where: { id: user.id }
                    }
                ).catch((err) => {
                    console.error("Unable to update user's displayName: ", err);
                });
            }
        } catch (err) {
            console.error("Unable to update diplayNames: ", err);
        }
    },

    async down () {
        /**
        * Add reverting commands here.
        *
        * Example:
        * await queryInterface.dropTable('users');
        */
    }
};
