const Replay = (sequelize, Sequelize) =>{
    const replay = sequelize.define("replay", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        commentId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        replay: {
            type: Sequelize.TEXT,
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
    return replay;
}

module.exports = Replay;
