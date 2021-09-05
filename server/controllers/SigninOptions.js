const db = require("../models");
const SigninOption = db.SigninOption;
const User = db.User;

// Create and Save a new User
module.exports.createSigninOption = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url
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
    .catch(err => {//catch any errors
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the SigninOption."
        });
    });
    return res.send({message:"SigninOption successfully created!", signinOption});//return a success message + the newly created signinOption
};

// Retrieve all SigninOptions from the database.
module.exports.getAllSigninOption = async (req, res) => {
    let signinOption = await SigninOption.findAll();
    return res.send(signinOption);
};

// Get all SigninOptions for a user
module.exports.getSigninOptionsByUserID = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url

    // OPTION 1 access via user then access signinOptions as association
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

    // OPTION 2 access via signinOptions
    // let signinOptions = await SigninOption.findAll({//get user and all signinOptions
    //     where: {
    //         user_id: user_id
    //     },
    //     include: {
    //         model: User,
    //         as: "user"
    //         // attributes: ['id','username'],
    //     }
    // });

    // OPTION 3 no user info
    // let signinOptions = await SigninOption.findAll({//get all signinOptions
    //     where: {
    //         user_id: user_id
    //     }
    // });


    if (!signinOptions) return res.status(404).send("signinOptions not found");
    return res.send(signinOptions);
}

// Find a single SigninOption using service_name and email
module.exports.getSigninOption = async (req, res) => {//may need to change to a post request??
    let email = req.params.email;//temporarily getting the email from the url
    let service_name = req.params.service_name;//temporarily getting the service_name from the url
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
        .catch(err => {//catch any errors
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the User."
            });
        });
        return res.send({message:"User and signinOption successfully created!", user});
    }
    return res.send(signinOption);//return the signinoption with the user if it was found
};

// Update a User by the id in the request
// exports.updateUser = async (req, res) => {
//     let userId = req.params.id;
//     await User.update(req.body, {
//         where: {
//             id: userId
//         },
//         returning: true,
//         plain: true
//     })
//     .then(user => {
//         return res.send(user[1]);
//     })
//     .catch(err => {
//         return res.status(500).send(err);
//     });
// };

// // Delete a User with the specified id in the request
// exports.delete = (req, res) => {
  
// };

// // Delete all Users from the database.
// exports.deleteAll = (req, res) => {
  
// };