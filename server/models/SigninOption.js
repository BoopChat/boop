module.exports = (sequelize, Sequelize) => {
    const SigninOption = sequelize.define("SigninOption", {
        //attributes
        serviceName: { primaryKey: true, type: Sequelize.STRING(20), allowNull: false, field: "service_name" },
        email: { primaryKey: true, type: Sequelize.STRING(320), allowNull: false },
        userId: { type: Sequelize.INTEGER, allowNull: false, field: "user_id" },
        //timestamps
        createdAt: { type: Sequelize.DATE, field: "created_at", defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE, field: "updated_at", defaultValue: Sequelize.NOW  }
    });

    SigninOption.associate = ({
        User
    })=>{
        SigninOption.belongsTo(User, {
            as: "user",
            foreignKey: "userId"
        });
    };

    return SigninOption;
};