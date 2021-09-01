module.exports = (sequelize, Sequelize) => {
    const Conversation = sequelize.define("Conversation", {
        id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        title: { type: Sequelize.STRING, allowNull: false },
        started_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.Now}
    });

    Conversation.associate = ({
        Message,
        Participant,
        User
    })=>{
        Conversation.hasMany(Message, {
            as: "messages",
            foreignKey: "conversation_id"
        });
        Conversation.belongsToMany(User, {
            as: "participants",
            through: Participant,
            foreignKey: "conversation_id"
        });
    }
    
    return Conversation;
};