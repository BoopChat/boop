module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("Message", {
        id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        content: { type: Sequelize.STRING, allowNull: false },
        sent_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.Now},
        conversation_id: { type: Sequelize.STRING, allowNull: false },
        user_id: { type: Sequelize.STRING, allowNull: false },
    });

    Message.associate = ({
        Conversation,
        User
    })=>{
        Message.belongsTo(Conversation, {
            as: "conversation",
            foreignKey: "conversation_id"
        });
        Message.belongsTo(User, {
            as: "user",
            foreignKey: "user_id"
        });
    }
    
    return Message;
};