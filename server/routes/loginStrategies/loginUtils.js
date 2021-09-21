
const db = require("../../models");
const SigninOption = db.SigninOption;
const User = db.User;

module.exports.getSigninOption = async function({ email, serviceName, firstName, lastName, imageUrl }){
    // try to find the signinOption
    let signinOption = await SigninOption.findOne({
        where: {
            email: email,
            serviceName: serviceName
        },
        include: {
            model: User,
            as: "user",
            include: {
                model: SigninOption,
                as: "signinOptions",
                where: {
                    email: email,
                    serviceName: serviceName
                },
                attributes: ["serviceName", "email"]
            }
        }
    });

    // if the signinOption doesn't exist, then this turns into a sign up
    // and a new user and signinOption are created
    if (!signinOption) {
        //try to create the new user and associate it with a new signinOption
        // with the input serviceName and email
        let user = await User.create({
            displayName: email,
            firstName: firstName,
            lastName: lastName,
            imageUrl: imageUrl,
            signinOptions: {
                serviceName: serviceName,
                email: email,
            }
        }, {
            include: {
                model: SigninOption,
                as: "signinOptions",
                where: {
                    email: email,
                    serviceName: serviceName
                },
            }
        }).catch(err => { //catch any errors
            return {
                "msg":
                err.message || "Some error occurred while creating the User."
            };
        });

        return { "msg": "User and signinOption successfully created!", "user": user };
    }

    // store the user info (from the successfully retrieved signinOption)
    // that will be returned in a variable
    let user = signinOption.user;

    //return the user with the signinOption if the signinOption was found
    return { "msg": "User successfully retieved!", "user": user };
};