const Like = (sequelize, Sequelize) =>{
    const like = sequelize.define("like", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        postId: {
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
    return like;
}

module.exports = Like;
