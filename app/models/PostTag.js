const PostTag = (sequelize, Sequelize) =>{
    const postTag = sequelize.define("postTag", {
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
        }
    },
    {
        timestamps: 1
    });
    return postTag;
}

module.exports = PostTag;
