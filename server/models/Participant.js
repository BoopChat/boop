module.exports = (sequelize, Sequelize) => {
    const Participant = sequelize.define("Participant", {
        //attributes
        userId: { primaryKey: true, type: Sequelize.INTEGER, allowNull: false, field: "user_id" },
        conversationId: { primaryKey: true, type: Sequelize.BIGINT, allowNull: false, field: "conversation_id" },
        isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, field: "is_admin"},
        //timestamps
        createdAt: { type: Sequelize.DATE, field: "created_at", defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE, field: "updated_at", defaultValue: Sequelize.NOW },
        deletedAt: { type: Sequelize.DATE, field: "deleted_at" }
    },
    {
        // use soft delete by default
        paranoid: true
    }
    );

    Participant.associate = ({
        Conversation,
        User
    }) => {
        Participant.belongsTo(Conversation, {
            as: "conversationInfo",
            foreignKey: "conversationId",
            onDelete: "CASCADE"
        });
        Participant.belongsTo(User, {
            as: "participantInfo",
            foreignKey: "userId"
        });
    };

    return Participant;
};