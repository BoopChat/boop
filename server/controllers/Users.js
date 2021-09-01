const db = require("../models");
const User = db.User;
const Op = db.Sequelize.Op;

// Create and Save a new User
module.exports.createUser = async (req, res) => {
    // Validate request
    if (
        !req.body.username 
        && !req.body.firstname
        && !req.body.lastname
        ) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    let user = await User.create({
        id: Math.floor(Math.random() * 999999) + 1,//just temporary
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        last_active: db.Sequelize.fn('NOW'),// set to current time
        image_url: req.body.image_url
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the User."
        });
    });
    return res.send({message:"User successfully create!", user});
};

// Retrieve all Users from the database.
module.exports.getAllUsers = async (req, res) => {
    let users = await User.findAll();
    return res.send(users);
};

// Find a single User with an id
module.exports.getUser = async (req, res) => {
    let userId = req.params.id;
    console.log(`userId: ${userId}`);
    // if (!Sequelize.Types.ObjectId.isValid(userId))
    //     return res.status(400).send("Invalid object id");
    let user = await User.findByPk(userId);
    if (!user) return res.status(404).send("User not found");
    return res.send(user);
};

// Update a User by the id in the request
exports.updateUser = async (req, res) => {
    let userId = req.params.id;
    await User.update(req.body, {
        where: {
            id: userId
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