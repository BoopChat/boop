module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        //attributes
        id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true, allowNull: false },
        displayName: { type: Sequelize.STRING(50), allowNull: false, field: "display_name" },
        firstName: { type: Sequelize.STRING(50), allowNull: true , field: "first_name"},
        lastName: { type: Sequelize.STRING(50), allowNull: true, field: "last_name" },
        imageUrl: { type: Sequelize.STRING(2048), allowNull: true, field: "image_url" },
        // timestamps
        lastActive: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW, field: "last_active" },
        createdAt: { type: Sequelize.DATE, field: "created_at", defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE, field: "updated_at", defaultValue: Sequelize.NOW }
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
            foreignKey: "userId"
        });
        User.hasMany(Contact, {
            as: "contactList",
            foreignKey: "userId"
        });
        User.hasMany(Contact, {
            as: "userList",
            foreignKey: "userId"
        });
        User.belongsToMany(Conversation, {
            as: "conversationList",
            through: Participant,
            foreignKey: "userId"
        });
        User.hasMany(Message, {
            as: "messages",
            foreignKey: "senderId"
        });
    };

    return User;
};