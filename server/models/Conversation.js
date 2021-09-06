module.exports = (sequelize, Sequelize) => {
    const Conversation = sequelize.define("Conversation", {
        //attributes
        id: {
            primaryKey: true,
            type: Sequelize.BIGINT,
            autoIncrement: true,
            allowNull: false
        },
        title: { type: Sequelize.STRING(25), allowNull: true },
        image_url: { type: Sequelize.STRING(2048), allowNull: true },
        user_editable_image:  { type: Sequelize.BOOLEAN, defaultValue: false},
        user_editable_title:  { type: Sequelize.BOOLEAN, defaultValue: false},
        //timestamps
        createdAt: {
            type: Sequelize.DATE, field: 'created_at', defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE, field: 'updated_at', defaultValue: Sequelize.NOW
        }
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