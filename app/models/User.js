const User = (sequelize, Sequelize) =>{
    const user = sequelize.define("user", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        aid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true
        },
        mobile: {
            type: Sequelize.STRING,
            unique: true
        },
        profilePic: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dob: {
            type: Sequelize.DATE,
            allowNull: true
        },
        bio: {
            type: Sequelize.STRING,
            allowNull: true
        },
        privacy: {
            type: Sequelize.ENUM('PUBLIC', 'PRIVATE'),
            defaultValue : 'PUBLIC'
        }
    },
    {
        timestamps: 1
    });
    return user;
}

module.exports = User;