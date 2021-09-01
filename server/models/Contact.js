module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("Contact", {
        contact_id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        user_id: { primaryKey: true, type: Sequelize.STRING, allowNull: false }
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