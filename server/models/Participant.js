module.exports = (sequelize, Sequelize) => {
    const Participant = sequelize.define("Participant", {
        //attributes
        user_id: { primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
        conversation_id: { primaryKey: true, type: Sequelize.BIGINT, allowNull: false },
        is_admin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
        //timestamps
        createdAt: {
            type: Sequelize.DATE, field: 'created_at', defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE, field: 'updated_at', defaultValue: Sequelize.NOW
        }
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