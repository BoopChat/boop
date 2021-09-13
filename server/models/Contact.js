module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("Contact", {
        //attributes
        contactId: { primaryKey: true, type: Sequelize.INTEGER, allowNull: false, field: "contact_id" },
        userId: { primaryKey: true, type: Sequelize.INTEGER, allowNull: false, field: "user_id" },
        //timestamps
        createdAt: {
            type: Sequelize.DATE, field: "created_at", defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE, field: "updated_at", defaultValue: Sequelize.NOW
        }
    });

    Contact.associate = ({
        User
    })=>{
        Contact.belongsTo(User, {
            as: "contactInfo",
            foreignKey: "contactId"
        });
        Contact.belongsTo(User, {
            as: "userInfo",
            foreignKey: "userId"
        });
    };

    return Contact;
};