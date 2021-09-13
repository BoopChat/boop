
const db = require("../../models");
const SigninOption = db.SigninOption;
const User = db.User;

module.exports.getSigninOption = async function({email, service_name, first_name, last_name, image_url}){
    // try to find the signinOption
    let signinOption = await SigninOption.findOne({
        where: {
            email: email,
            service_name: service_name
        },
        include: {
            model: User,
            as: "user",
            include: {
                model: SigninOption,
                as: "signinOptions",
                where: {
                    email: email,
                    service_name: service_name
                },
                attributes: ["service_name","email"]
            }
        }
    });

    // if the signinOption doesn't exist, then this turns into a sign up
    // and a new user and signinOption are created
    if (!signinOption) {
        //try to create the new user and associate it with a new signinOption
        // with the input service_name and email
        let user = await User.create({
            display_name: email,
            first_name: first_name,
            last_name: last_name,
            image_url: image_url,
            signinOptions: {
                service_name: service_name,
                email: email,
            }
        }, {
            include: {
                model: SigninOption,
                as: "signinOptions",
                where: {
                    email: email,
                    service_name: service_name
                },
            }
        }).catch(err => { //catch any errors
            return {
                "msg":
                err.message || "Some error occurred while creating the User."
            };
        });

        return {"msg": "User and signinOption successfully created!", "user": user};
    }

    // store the user info (from the successfully retrieved signinOption)
    // that will be returned in a variable
    let user = signinOption.user;

    //return the user with the signinOption if the signinOption was found
    return {"msg": "User successfully retieved!", "user": user};
};