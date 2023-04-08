const config = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
      host: config.HOST,
      dialect: config.dialect,
      operatorsAliases: 0,
  
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
      }
    }
  );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.auth = require("./Auth")(sequelize, Sequelize);
db.user = require("./User")(sequelize, Sequelize);
db.follow = require("./Follow")(sequelize, Sequelize);
db.post = require("./Post")(sequelize, Sequelize);
db.postTag = require("./PostTag")(sequelize, Sequelize);
db.comment = require("./Comment")(sequelize, Sequelize);
db.like = require("./Like")(sequelize, Sequelize);
db.replay = require("./Replay")(sequelize, Sequelize);
db.followRequest = require("./FollowRequest")(sequelize, Sequelize);


db.auth.hasOne(db.user, {foreignKey: 'aid'});
db.user.belongsTo(db.auth, {foreignKey: 'aid'});

db.follow.belongsTo(db.user, {foreignKey: 'followingId', as: 'followingIds'});
db.user.hasMany(db.follow, {foreignKey: 'followingId', as: 'followingIds'});

db.follow.belongsTo(db.user, {foreignKey: 'followerId', as: 'followerIds'});
db.user.hasMany(db.follow, {foreignKey: 'followerId', as: 'followerIds'});

db.post.belongsTo(db.user, {foreignKey: 'userId'});
db.user.hasMany(db.post, {foreignKey: 'userId'});

db.postTag.belongsTo(db.post, {foreignKey: 'postId'});
db.post.hasMany(db.postTag, {foreignKey: 'postId'});

db.postTag.belongsTo(db.user, {foreignKey: 'userId'});
db.user.hasMany(db.postTag, {foreignKey: 'userId'});

db.comment.belongsTo(db.post, {foreignKey: 'postId'});
db.post.hasMany(db.comment, {foreignKey: 'postId'});

db.comment.belongsTo(db.user, {foreignKey: 'userId'});
db.user.hasMany(db.comment, {foreignKey: 'userId'});

db.like.belongsTo(db.post, {foreignKey: 'postId'});
db.post.hasMany(db.like, {foreignKey: 'postId'});

db.like.belongsTo(db.user, {foreignKey: 'userId'});
db.user.hasMany(db.like, {foreignKey: 'userId'});

db.replay.belongsTo(db.comment, {foreignKey: 'commentId'});
db.comment.hasMany(db.replay, {foreignKey: 'commentId'});

db.replay.belongsTo(db.user, {foreignKey: 'userId'});
db.user.hasMany(db.replay, {foreignKey: 'userId'});

db.followRequest.belongsTo(db.user, {foreignKey: 'userId', as: 'userIds'});
db.user.hasMany(db.followRequest, {foreignKey: 'userId', as: 'userIds'});

db.followRequest.belongsTo(db.user, {foreignKey: 'followerId', as: 'reqUserId'});
db.user.hasMany(db.followRequest, {foreignKey: 'followerId', as: 'reqUserId'});

module.exports = db;