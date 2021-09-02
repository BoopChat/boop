module.exports = (sequelize, Sequelize) => {
    const SigninOption = sequelize.define("SigninOption", {
        //attributes
        user_id: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        service_name: { primaryKey: true, type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        token: { type: Sequelize.STRING, allowNull: false },
        //timestamps
        createdAt: { type: Sequelize.DATE, field: 'created_at', defaultValue: Sequelize.NOW},
        updatedAt: { type: Sequelize.DATE, field: 'updated_at', defaultValue: Sequelize.NOW }
    });

    SigninOption.associate = ({
        User
    })=>{
        SigninOption.belongsTo(User, {
            as: "user",
            foreignKey: "user_id"
        });
    }
    
    return SigninOption;
};