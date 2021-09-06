module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        //attributes
        id: { primaryKey: true, type: Sequelize.INTEGER, autoIncrement: true, allowNull: false },
        display_name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
        first_name: { type: Sequelize.STRING(50), allowNull: true },
        last_name: { type: Sequelize.STRING(50), allowNull: true },
        image_url: { type: Sequelize.STRING(2048), allowNull: true },
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
        User.belongsToMany(Conversation, {
            as: "conversationList",
            through: Participant,
            foreignKey: "user_id"
        });
        User.hasMany(Message, {
            as: "messages",
            foreignKey: "sender_id"
        });
    };
    
    return User;
};