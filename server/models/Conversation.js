module.exports = (sequelize, Sequelize) => {
    const Conversation = sequelize.define("Conversation", {
        //attributes
        id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        title: { type: Sequelize.STRING, allowNull: false },
        //timestamps
        createdAt: { type: Sequelize.DATE, field: 'created_at', defaultValue: Sequelize.NOW},
        updatedAt: { type: Sequelize.DATE, field: 'updated_at', defaultValue: Sequelize.NOW }
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