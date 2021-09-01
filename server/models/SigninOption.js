module.exports = (sequelize, Sequelize) => {
    const SigninOption = sequelize.define("SigninOption", {
        user_id: { type: Sequelize.STRING, allowNull: false },
        service_name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        token: { type: Sequelize.STRING, allowNull: false },
    });

    SigninOption.associate = ({
        User
    })=>{
        SigninOption.belongsTo(User, {
            as: "users",
            foreignKey: "user_id"
        });
    }
    
    return SigninOption;
};