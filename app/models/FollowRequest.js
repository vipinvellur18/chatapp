const FollowRequest = (sequelize, Sequelize) =>{
    const followRequest = sequelize.define("followRequest", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        followerId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue : 'ACTIVE'
        },
    },
    {
        timestamps: 1
    });
    return followRequest;
}

module.exports = FollowRequest;
