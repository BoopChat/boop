module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("Contact", {
        //attributes
        contact_id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        user_id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        //timestamps
        createdAt: { type: Sequelize.DATE, field: 'created_at', defaultValue: Sequelize.NOW},
        updatedAt: { type: Sequelize.DATE, field: 'updated_at', defaultValue: Sequelize.NOW }
    });

    // MAY NOT BE NEEDED
    // Contact.associate = ({
    //     User
    // })=>{
    //     Contact.hasMany(User, {
    //         as: "contacts",
    //         foreignKey: "contact_id"
    //     });
    //     Contact.belongsToMany(User, {
    //         as: "owners",
    //         foreignKey: "user_id"
    //     });
    // };
    
    return Contact;
};