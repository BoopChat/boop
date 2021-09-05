const db = require("../models");
const SigninOption = db.SigninOption;
const User = db.User;

//These operations can be integrated into a LoginAuth controller

// Create and Save a new SigninOption
module.exports.createSigninOption = async (req, res) => {
    let user_id = req.params.user_id;

    // Need to check that user_id belongs to a valid user and matches the id of the requesting user


    // Validate request
    if (
        !user_id
        || !req.body.service_name
        || !req.body.email
        ) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    let signinOption = await SigninOption.create({
        user_id: user_id,
        service_name: req.body.service_name,
        email: req.body.email
    })
    //catch any errors
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the SigninOption."
        });
    });

    //return a success message + the newly created signinOption
    return res.send({message:"SigninOption successfully created!", signinOption});
};


// Get all SigninOptions for a user
module.exports.getSigninOptionsByUserID = async (req, res) => {
    let user_id = req.params.user_id;

    // Need to check that user_id belongs to a valid user and matches the id of the requesting user


    // access via user then access signinOptions as association
    let signinOptions = await User.findOne({//get user and all signinOptions
        where: {
            id: user_id
        },
        include: {
            model: SigninOption,
            as: "signinOptions"
            // attributes: ['email','service_name'],
        }
    });

    if (!signinOptions) return res.status(404).send("signinOptions not found");
    return res.send(signinOptions);
}

// Find a single SigninOption using service_name and email
module.exports.getSigninOption = async (req, res) => {//may need to change to a post request??

    let email = req.params.email;
    let service_name = req.params.service_name;



    // Need to check that email belongs to a valid user and matches the email of the requesting user


    // try to find the signinOption
    let signinOption = await SigninOption.findOne({
        where: {
            email: email,
            service_name: service_name
        },
        include: {
            model: User,
            as: "user"
            // attributes: ['id','username'],
        }
    });

    // if the signinOption doesn't exist, then this turns into a sign up and a new user and signinOption are created
    if (!signinOption){
    
        let user = await User.create({
            display_name: email,
            first_name: req.body.given_name,
            last_name: req.body.family_name,
            image_url: req.body.picture,
            signinOptions: {
                service_name: service_name,
                email: email,
            }
        }, {
            include: {
                model: SigninOption,
                as: "signinOptions"
            }
        })
        //catch any errors
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the User."
            });
        });
        return res.send({message:"User and signinOption successfully created!", user});
    }
    //return the signinoption with the user if it was found
    return res.send(signinOption);
};

// // Update a SigninOption by the id in the request
// exports.updateSigninOptions = async (req, res) => {
//     //temporarily getting the email from the url
//     let email = req.params.email;
//     //temporarily getting the service_name from the url
//     let service_name = req.params.service_name;

//     await SigninOption.update(req.body, {
//         where: {
//             email: email,
//             service_name: service_name
//         },
//         returning: true,
//         plain: true
//     })
//     .then(signinOption => {
//         return res.send(signinOption[1]);
//     })
//     .catch(err => {
//         return res.status(500).send(err);
//     });
// };

// // Delete a User with the specified id in the request
// exports.deleteSigninOption = async (req, res) => {
//     //temporarily getting the email from the url
//     let email = req.params.email;
//     //temporarily getting the service_name from the url
//     let service_name = req.params.service_name;

//     await SigninOption.destroy({
//         where: {
//             email: email,
//             service_name: service_name
//         }
//     })
//     .then(num => {
//         if (num == 1) {
//             res.send({
//                 message: "SigninOption was deleted successfully!"
//             });
//         } else {
//             res.send({
//                 message: `Cannot delete SigninOption with email=${email} and service_name=${service_name}. Maybe SigninOption was not found!`
//             });
//         }
//     })
//     .catch(err => {
//         res.status(500).send({
//             message: `Could not delete SigninOption with email=${email} and service_name=${service_name}`
//         });
//     });
// };