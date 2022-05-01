"use strict";

const db = require("../models");
const User = db.User;
const SigninOption = db.SigninOption;
const crypto = require("crypto");

module.exports = {
    async up (queryInterface, Sequelize) {
        try {
            // get all existing users that don't have a booptag
            let users = await User.findAll({
                where: { booptag: null },
                // specify what attributes you want returned
                attributes: ["id", "booptag", "firstName", "lastName", "imageUrl", "createdAt"],
                // get each users's info from the SigninOptions table
                include: {
                    model: SigninOption,
                    as: "signinOptions",
                    // specify what attributes you want returned
                    attributes: ["serviceName", "email"]
                }
            });

            // update all the users that didn't have a booptag w/ a new booptag
            for (const user of users) {
                await User.update(
                    {
                        booptag: crypto.createHash("md5")
                            .update(
                                ""+user.signinOptions[0].email+user.signinOptions[0].serviceName+user.firstName+
                                user.lastName+user.imageUrl+user.createdAt
                            )
                            .digest("hex")
                    },
                    {
                        where: { id: user.id }
                    }
                ).catch((err) => {
                    console.error("Unable to update user's booptag: ", err);
                });
            }

            // add not null and unique to the booptag column
            await queryInterface.changeColumn(
                "Users",
                "booptag",
                {
                    type: Sequelize.STRING(32),
                    allowNull: false,
                    unique: true,
                    validate: {
                        notEmpty: true,
                    },
                }
            ).catch((err) => {
                console.error("Unable to update Users table booptag column: ", err);
            });

        } catch (err){
            console.error("Unable to update Users table: ", err);
        }

    },

    async down (queryInterface) {
        // logic for reverting the change
        try {
            await queryInterface.changeColumn(
                "Users",
                "booptag",
                {
                    allowNull: true,
                    unique: false
                }
            ).catch((err) => {
                console.error("Unable to update Users table booptag column: ", err);
            });
        } catch (err){
            console.error("Unable to update Users table: ", err);
        }
    }
};
