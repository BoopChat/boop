module.exports = (sequelize, Sequelize) => {
    const Participant = sequelize.define("Participant", {
        //attributes
        user_id: { primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
        conversation_id: { primaryKey: true, type: Sequelize.BIGINT, allowNull: false },
        is_admin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
        //timestamps
        createdAt: {
            type: Sequelize.DATE, field: "created_at", defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE, field: "updated_at", defaultValue: Sequelize.NOW
        },
        deletedAt: { type: Sequelize.DATE, field: "deleted_at" }
    },
    {
        paranoid: true
    }
    );

    Participant.associate = ({
        Conversation,
        User
    })=>{
        Participant.belongsTo(Conversation, {
            as: "conversationInfo",
            foreignKey: "conversation_id",
            onDelete: "CASCADE"
        });
        Participant.belongsTo(User, {
            as: "participantInfo",
            foreignKey: "user_id"
        });
    };

    return Participant;
};