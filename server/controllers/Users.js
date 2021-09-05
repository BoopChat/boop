const { Sequelize } = require("../models");
const db = require("../models");
const User = db.User;
const Op = db.Sequelize.Op;

// Create and Save a new User
module.exports.createUser = async (req, res) => {
    // Validate request
    if (
        !req.body.display_name 
        ) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    // try to create the user
    let user = await User.create({// id is auto-incremented and auto assigned, last_active is auto-set to current time
        display_name: req.body.display_name,
        first_name: req.body.given_name,
        last_name: req.body.family_name,
        image_url: req.body.image_url,
    })
    .catch(err => {//catch any errors
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the User."
        });
    });
    return res.send({message:"User successfully created!", user});//return a success message + the newly created user
};

// Retrieve all Users from the database.
module.exports.getAllUsers = async (req, res) => {
    let users = await User.findAll();
    return res.send(users);
};

// Find a single User with an id
module.exports.getUser = async (req, res) => {
    let user_id = req.params.id;//temporarily getting the user_id from the url

    let user = await User.findByPk(user_id);
    if (!user) return res.status(404).send("User not found");
    return res.send(user);
};

// Update a User by the id in the request
exports.updateUser = async (req, res) => {
    let user_id = req.params.id;//temporarily getting the user_id from the url

    await User.update({
        display_name: req.body.display_name,
        first_name: req.body.given_name,
        last_name: req.body.family_name,
        image_url: req.body.image_url,
        // last_active: db.Sequelize.fn('NOW') // update last_active to current time???
    }, {
        where: {
            id: user_id
        },
        returning: true,
        plain: true
    })
    .then(user => {
        return res.send(user[1]);
    })
    .catch(err => {
        return res.status(500).send(err);
    });
};

// // Delete a User with the specified id in the request
// exports.delete = (req, res) => {
  
// };

// // Delete all Users from the database.
// exports.deleteAll = (req, res) => {
  
// };