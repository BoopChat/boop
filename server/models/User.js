module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        //attributes
        id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        username: { type: Sequelize.STRING, allowNull: false },
        firstname: { type: Sequelize.STRING, allowNull: true },
        lastname: { type: Sequelize.STRING, allowNull: true },
        image_url: { type: Sequelize.STRING, allowNull: true },
        // timestamps
        last_active: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        createdAt: { type: Sequelize.DATE, field: 'created_at', defaultValue: Sequelize.NOW},
        updatedAt: { type: Sequelize.DATE, field: 'updated_at', defaultValue: Sequelize.NOW }
    });

    User.associate = ({
        SigninOption,
        Contact,
        Conversation,
        Participant,
        Message
    })=>{
        User.hasMany(SigninOption, {
            as: "signinOptions",
            foreignKey: "user_id"
        });
        User.hasMany(Contact, {
            as: "contactList",
            foreignKey: "user_id"
        });
        User.hasMany(Contact, {
            as: "userList",
            foreignKey: "user_id"
        });
        // User.belongsToMany(User, {
        //     as: "contacts",
        //     through: Contact,
        //     foreignKey: "contact_id"
        // });
        // User.belongsToMany(User, {
        //     as: "users",
        //     through: Contact,
        //     foreignKey: "user_id"
        // });
        User.belongsToMany(Conversation, {
            as: "conversations",
            through: Participant,
            foreignKey: "user_id"
        });
        User.hasMany(Message, {
            as: "messages",
            foreignKey: "user_id"
        });
    };
    
    return User;
};