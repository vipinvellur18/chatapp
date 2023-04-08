const db = require('../models');
const Auth = db.auth;
const User = db.user;
const Follow = db.follow;
const FollowRequest = db.followRequest;
const Op = db.Sequelize.Op;
const {getPagination,getPagingData} = require('../helpers/pagination');

exports.follow = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        if(user.id === req.body.followingId){
            res.status(400).send({
                message: "You cannot follow yourself!"
            });
            return;
        }

        let following = await User.findOne({
            where: {
                id: req.body.followingId
            }
        });

        if(following){
            if(following.privacy === 'PRIVATE'){

                let followRequest = await FollowRequest.findOne({
                    where: {
                        [Op.and]: [
                            {userId: user.id},
                            {followerId: following.id}
                        ]
                    }
                });

                if(!followRequest){

                    await FollowRequest.create({
                        userId: user.id,
                        followerId: following.id,
                    });

                    res.status(400).send({
                        message: "Follow request sent!"
                    });
                    return;
                }else{
                    
                    res.status(400).send({
                        message: "Follow request already sent!"
                    });
                    return;
                }
                
                res.status(400).send({
                    message: "Follow request sent!"
                });
                return;
            }
        }

        if(!following){
            res.status(400).send({
                message: "Following user not found!"
            });
            return;
        }

        let follow = await Follow.findOne({where: {followerId: user.id, followingId: following.id}});

        if(follow){
            res.status(400).send({
                message: "You are already following this user!"
            });
            return;
        }

        const followData = {
            followerId: user.id,
            followingId: following.id
        };

        await Follow.create(followData).then(data => {
            res.status(200).json({
                message: "User followed successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while following the user."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while following the user."
        });
    }

}

exports.getFollowers = async function(req, res) {

    try{

        let user = await User.findOne({where: {id: req.params.uid}});

        let me = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        if(user.privacy === 'PRIVATE' && req.params.uid !== me.id){

            const followRequest = await Follow.findOne({
                where: {
                    [Op.and]: [
                        {followingId: user.id},
                        {followerId: me.id }
                    ]
                }
            });


            if(!followRequest){
                res.status(400).send({
                    message: "Private profile! Follow the user to view followers."
                });
                return;
            }

        }

        const page = req.query.page;
        const size = req.query.size;
        const { limit, offset } = getPagination(page, size);
        let  Searchattributes ={limit, offset};

        Searchattributes = {
            ...Searchattributes,
            attributes: ['id'],
            distinct: true,
            where: {
                followingId: user.id
            }, 
            include: [
                {
                    model: User, as: 'followerIds'
                }
            ]
        }       

        let followers = await Follow.findAndCountAll(Searchattributes);

        const response = getPagingData(followers, page, limit);

        if(!followers){
            res.status(400).send({
                message: "No followers found!"
            });
            return;
        }

        res.status(200).json({
            message: "Followers fetched successfully!",
            data: response
        });

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while fetching followers."
        });
    }

}

exports.getFollowing = async function(req, res) {

    try{

        let user = await User.findOne({where: {id: req.params.uid}});

        let me = await User.findOne({where: {aid: req.user.id}});


        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        if(user.privacy === 'PRIVATE' && req.params.uid !== me.id){

            const followRequest = await Follow.findOne({
                where: {
                    [Op.and]: [
                        {followingId: user.id},
                        {followerId: me.id }
                    ]
                }
            });

            if(!followRequest){
                res.status(400).send({
                    message: "Private profile! Follow the user to view followers."
                });
                return;
            }

        }
        
        const page = req.query.page;
        const size = req.query.size;
        const { limit, offset } = getPagination(page, size);
        let  Searchattributes ={limit, offset};

        Searchattributes = {
            ...Searchattributes,
            attributes: ['id'],
            where: {
                followerId: user.id
            },
            distinct: true,
            include: [
                {
                    model: User, 
                    as: 'followingIds'
                }
            ]
        }       

        let following = await Follow.findAndCountAll(Searchattributes);

        const response = getPagingData(following, page, limit);

        if(!following){
            res.status(400).send({
                message: "No following found!"
            });
            return;
        }

        res.status(200).json({
            message: "Following fetched successfully!",
            data: response
        });

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while fetching following."
        });
    }

}

exports.unfollow = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let following = await User.findOne({where: {id: req.body.followingId}});

        if(!following){
            res.status(400).send({
                message: "Following user not found!"
            });
            return;
        }

        let follow = await Follow.findOne({where: {followerId: user.id, followingId: following.id}});

        if(!follow){
            res.status(400).send({
                message: "You are not following this user!"
            });
            return;
        }

        await follow.destroy().then(data => {
            res.status(200).json({
                message: "User unfollowed successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while unfollowing the user."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while unfollowing the user."
        });
    }

}

exports.removeFollower = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let follower = await User.findOne({where: {id: req.body.followerId}});

        if(!follower){
            res.status(400).send({
                message: "Follower user not found!"
            });
            return;
        }

        let follow = await Follow.findOne({where: {followerId: follower.id, followingId: user.id}});

        if(!follow){
            res.status(400).send({
                message: "This user is not following you!"
            });
            return;
        }

        await follow.destroy().then(data => {
            res.status(200).json({
                message: "Follower removed successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while removing the follower."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing the follower."
        });
    }

}

exports.followRequestRemove = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let followRequest = await FollowRequest.findOne({
            where: {
                [Op.and]: [
                    {followerId: req.params.id},
                    {userId: user.id}
                ]
            }
        });

        if(!followRequest){
            res.status(400).send({
                message: "Follow request not found!"
            });
            return;
        }

        await followRequest.destroy().then(data => {
            res.status(200).json({
                message: "Follow request removed successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while removing the follow request."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing the follow request."
        });
    }

}

exports.followRequestAccept = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let followRequest = await FollowRequest.findOne({
            where: {
                [Op.and]: [
                    {followerId: user.id},
                    {userId: req.params.id}
                ]
            }
        });

        if(!followRequest){
            res.status(400).send({
                message: "Follow request not found!"
            });
            return;
        }

        let follow = await Follow.findOne({
            where: {
                [Op.and]: [
                    {followerId: req.params.id},
                    {followingId: user.id}
                ]
            }
        });

        if(follow){
            res.status(400).send({
                message: "You are already following this user!"
            });
            return;
        }

        follow = await Follow.create({
            followerId: req.params.id,
            followingId: user.id
        });

        await followRequest.destroy().then(data => {
            res.status(200).json({
                message: "Follow request accepted successfully!",
                data: data
            });
        }
        ).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while accepting the follow request."
                });
            }
        );

    }
    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while accepting the follow request."
        });
    }

}

exports.followRequestReject = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        console.log("user id: " + user.id, "req.params.id: " + req.params.id)

        let followRequest = await FollowRequest.findOne({
            where: {
                [Op.and]: [
                    {followerId: user.id},
                    {userId: req.params.id}
                ]
            }
        });

        if(!followRequest){
            res.status(400).send({
                message: "Follow request not found!"
            });
            return;
        }

        await followRequest.destroy().then(data => {
            res.status(200).json({
                message: "Follow request rejected successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while rejecting the follow request."
                });
            }
        );

    }
    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while rejecting the follow request."
        });
    }

}

exports.getFollowRequests = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        const page = req.query.page;
        const size = req.query.size;
        const { limit, offset } = getPagination(page, size);
        let  Searchattributes ={limit, offset};

        Searchattributes = {
            ...Searchattributes,
            where: {
                followerId: user.id
            },
            order: [
                ['createdAt', 'DESC']
            ],
            distinct: true,
            include: [
                {
                    model: User,
                    as: "userIds",
                    attributes: ["id", "name", "profilePic"]
                }
            ]
        }       

        let followRequests = await FollowRequest.findAndCountAll(Searchattributes);

        const response = getPagingData(followRequests, page, limit);

        res.status(200).json({
            message: "Follow requests fetched successfully!",
            data: response
        });

    }
    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while fetching the follow requests."
        });
    }

}

exports.getSentFollowRequests = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        const page = req.query.page;
        const size = req.query.size;
        const { limit, offset } = getPagination(page, size);
        let  Searchattributes ={limit, offset};

        Searchattributes = {
            ...Searchattributes,
            where: {
                userId: user.id
            },
            order: [
                ['createdAt', 'DESC']
            ],
            distinct: true,
            include: [
                {
                    model: User,
                    as: "reqUserId",
                    attributes: ["id", "name", "profilePic"]
                }
            ]
        }       

        let followRequests = await FollowRequest.findAndCountAll(Searchattributes);

        const response = getPagingData(followRequests, page, limit);

        res.status(200).json({
            message: "Sent follow requests fetched successfully!",
            data: response
        });

    }
    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while fetching the sent follow requests."
        });
    }

}