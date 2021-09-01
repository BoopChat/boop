module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        username: { type: Sequelize.STRING, allowNull: false },
        firstname: { type: Sequelize.STRING, allowNull: false },
        lastname: { type: Sequelize.STRING, allowNull: false },
        last_active: { type: Sequelize.DATE, allowNull: false },
        image_url: { type: Sequelize.STRING, allowNull: true },
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
        User.belongsToMany(User, {
            as: "contacts",
            through: Contact,
            foreignKey: "contact_id"
        });
        User.belongsToMany(User, {
            as: "users",
            through: Contact,
            foreignKey: "user_id"
        });
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