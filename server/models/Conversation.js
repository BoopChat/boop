module.exports = (sequelize, Sequelize) => {
    const Conversation = sequelize.define("Conversation", {
        //attributes
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true, allowNull: false },
        title: { type: Sequelize.STRING(25), allowNull: true },
        imageUrl: { type: Sequelize.STRING(2048), allowNull: true, field: "image_url" },
        userEditableImage: { type: Sequelize.BOOLEAN, defaultValue: false, field: "user_editable_image" },
        userEditableTitle: { type: Sequelize.BOOLEAN, defaultValue: false, field: "user_editable_title" },
        //timestamps
        createdAt: { type: Sequelize.DATE, field: "created_at", defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE, field: "updated_at", defaultValue: Sequelize.NOW  }
    });

    Conversation.associate = ({
        Message,
        Participant,
        User
    }) => {
        Conversation.hasMany(Message, {
            as: "messages",
            foreignKey: "conversationId"
        });
        Conversation.belongsToMany(User, {
            as: "participants",
            through: Participant,
            foreignKey: "conversationId"
        });
    };

    return Conversation;
};