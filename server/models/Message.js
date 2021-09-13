module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("Message", {
        //attributes
        id: {
            primaryKey: true,
            type: Sequelize.BIGINT,
            autoIncrement: true,
            allowNull: false
        },
        content: { type: Sequelize.TEXT , allowNull: false },
        conversation_id: { type: Sequelize.BIGINT, allowNull: false },
        sender_id: { type: Sequelize.INTEGER, allowNull: false },
        //timestamps
        createdAt: {
            type: Sequelize.DATE, field: "created_at", defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE, field: "updated_at", defaultValue: Sequelize.NOW
        }
    });

    Message.associate = ({
        Conversation,
        User
    })=>{
        Message.belongsTo(Conversation, {
            as: "conversation",
            foreignKey: "conversation_id",
            onDelete: "CASCADE"
        });
        Message.belongsTo(User, {
            as: "sender",
            foreignKey: "sender_id"
        });
    };

    return Message;
};