module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("Contact", {
        //attributes
        contact_id: { primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
        user_id: { primaryKey: true, type: Sequelize.INTEGER, allowNull: false },
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
            foreignKey: "contact_id"
        });
        Contact.belongsTo(User, {
            as: "userInfo",
            foreignKey: "user_id"
        });
    };

    return Contact;
};