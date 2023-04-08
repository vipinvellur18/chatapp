const Auth = (sequelize, Sequelize) =>{
    const auth = sequelize.define("auth", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },        
        password: {
            type: Sequelize.STRING
        },
        last_login: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue : 'ACTIVE'
        }    
    },
    {
        timestamps: 1
    });
    return auth;
}

module.exports = Auth;
