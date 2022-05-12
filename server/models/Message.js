module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("Message", {
        //attributes
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true, allowNull: false },
        content: { type: Sequelize.TEXT, allowNull: false },
        conversationId: { type: Sequelize.BIGINT, allowNull: false, field: "conversation_id" },
        senderId: { type: Sequelize.INTEGER, allowNull: false, field: "sender_id" },
        //timestamps
        createdAt: {
            type: Sequelize.DATE, field: "created_at", defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE, field: "updated_at", defaultValue: Sequelize.NOW
        },
        readBy: {
            type: Sequelize.ARRAY(Sequelize.INTEGER), field: "read_by", defaultValue: []
        }
    });

    Message.associate = ({
        Conversation,
        User
    }) => {
        Message.belongsTo(Conversation, {
            as: "conversation",
            foreignKey: "conversationId",
            onDelete: "CASCADE"
        });
        Message.belongsTo(User, {
            as: "sender",
            foreignKey: "senderId"
        });
    };

    return Message;
};