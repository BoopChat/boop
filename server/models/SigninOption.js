module.exports = (sequelize, Sequelize) => {
    const SigninOption = sequelize.define("SigninOption", {
        //attributes
        service_name: { primaryKey: true, type: Sequelize.STRING(20), allowNull: false },
        email: { primaryKey: true, type: Sequelize.STRING(320), allowNull: false },
        user_id: { type: Sequelize.INTEGER, allowNull: false },
        //timestamps
        createdAt: {
            type: Sequelize.DATE, field: 'created_at', defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE, field: 'updated_at', defaultValue: Sequelize.NOW
        }
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