const Follow = (sequelize, Sequelize) =>{
    const follow = sequelize.define("follow", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        followerId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        followingId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue : 'ACTIVE'
        }
    },
    {
        timestamps: 1
    });
    return follow;
}

module.exports = Follow;
