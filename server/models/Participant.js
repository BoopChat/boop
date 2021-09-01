module.exports = (sequelize, Sequelize) => {
    const Participant = sequelize.define("Participant", {
        user_id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        conversation_id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        is_admin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
    });

    // MAY NOT BE NEEDED
    // Participant.associate = ({
    //     Conversation,
    //     User
    // })=>{
    //     Participant.hasMany(Conversation, {
    //         as: "conversations",
    //         foreignKey: "conversation_id"
    //     });
    //     Participant.hasMany(User, {
    //         as: "users",
    //         foreignKey: "user_id"
    //     });
    // }
    
    return Participant;
};