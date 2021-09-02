const db = require("../models");
const SigninOption = db.SigninOption;
const User = db.User;
const Op = db.Sequelize.Op;

// Create and Save a new User
module.exports.createSigninOption = async (req, res) => {
    // Validate request
    if (
        !req.body.user_id 
        && !req.body.service_name
        && !req.body.email
        && !req.body.token
        ) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    let signinOption = await SigninOption.create({
        user_id: req.body.user_id,
        service_name: req.body.service_name,
        email: req.body.email,
        token: req.body.token
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

module.exports.getSigninOptionsByUserID = async (req, res) => {
    let user_id = req.params.user_id;//temporariry getting the user_id from the url

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

// Find a single User with an id
module.exports.getSigninOption = async (req, res) => {//may need to change to a post request
    let token = req.params.token;//temporariry getting the token from the url
    let signinOption = await SigninOption.findOne({
        where: {
            token: token
        },
        include: {
            model: User,
            as: "user"
            // attributes: ['id','username'],
        }
    });

    // if the signinOption doesn't exist, then this turns into a sign up and a new user and signinOption are created
    if (!signinOption){
        if (
            !req.body.email 
            // && !req.body.token
            && !req.body.service_name
            && !req.body.given_name
            && !req.body.family_name
            ) {
            res.status(400).send({
            message: "Content can not be empty!"
            });
            return;
        }

        var user_id = Math.floor(Math.random() * 999999) + 1;//just temporary way to generate a user_id
    
        let user = await User.create({
            id: user_id,
            username: req.body.email,
            firstname: req.body.given_name,
            lastname: req.body.family_name,
            last_active: db.Sequelize.fn('NOW'),// set to current time
            image_url: req.body.picture,
            signinOptions: {
                user_id: user_id,
                service_name: req.body.service_name,
                email: req.body.email,
                token: token,
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