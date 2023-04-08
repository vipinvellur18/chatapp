const db = require('../models');
const Auth = db.auth;
const User = db.user;
const Follow = db.follow;
const Post = db.post;
const Op = db.Sequelize.Op;
const {getPagination,getPagingData} = require('../helpers/pagination');

exports.createProfile = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(user){

            await User.update({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                profilePic: req.body.profilePic,
                dob: req.body.dob,
                bio: req.body.bio
            }, {where: {aid: req.user.id}}).then(data => {
                res.status(200).json({
                    message: "User profile was updated successfully!"
                });
                return;
            }).catch(err => {
                    res.status(500).send({
                        message:
                        err.message || "Some error occurred while creating the User."
                    });
                }
            );
            
        }

        const profile = {
            aid: req.user.id,
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            profilePic: req.body.profilePic,
            dob: req.body.dob,
            bio: req.body.bio
        };

        await User.create(profile).then(data => {
                res.status(200).json({
                    message: "User profile was created successfully!",
                    data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the User."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the User."
        });
    }

}

exports.getProfile = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(user){

            res.status(200).json({
                message: "User profile was retrieved successfully!",
                data: user
            });
            return;

        }

        res.status(404).send({
            message: "User profile not found!"
        });

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving the User."
        });
    }

}

exports.profileUser = async function(req, res) {

    try{

        let user = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        let me = await User.findOne({where: {aid: req.user.id}});

        if(user){

            const follow = await Follow.findOne({
                where:
                    {
                        [Op.and]: [{followerId: me.id}, {followingId: user.id}]
                    }
            });

            if(follow){

                let followingCount = await Follow.count({
                    where: {
                        followerId: user.id
                    }
                });

                let followerCount = await Follow.count({
                    where: {
                        followingId: user.id
                    }
                });

                let postCount = await Post.count({
                    where: {
                        userId: user.id
                    }
                });

                user = user.toJSON();

                user.following = followingCount;
                user.follower = followerCount;
                user.post = postCount;


                res.status(200).json({
                    message: "User profile was retrieved successfully!",
                    data: user,
                    following: true
                });
                return;
            }


            if(user.privacy === "PRIVATE"){
                res.status(200).json({
                    message: "User profile is private!"
                });
                return;
            }

            let followingCount = await Follow.count({
                where: {
                    followerId: user.id
                }
            });

            let followerCount = await Follow.count({
                where: {
                    followingId: user.id
                }
            });

            let postCount = await Post.count({
                where: {
                    userId: user.id
                }
            });

            user = user.toJSON();

            user.following = followingCount;
            user.follower = followerCount;
            user.post = postCount;

            res.status(200).json({
                message: "User profile was retrieved successfully!",
                data: user
            });
            return;

        }

        res.status(404).send({
            message: "User profile not found!"
        });

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving the User."
        });
    }

}

exports.searchUser = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(user){

            const page = req.query.page;
            const size = req.query.size;
            const { limit, offset } = getPagination(page, size);
            let  Searchattributes ={limit, offset};
    
            Searchattributes = {
                ...Searchattributes,
                distinct: true,
                where: {
                    [Op.and]: [{name: {[Op.like]: `%${req.query.search}%`}}, {id: {[Op.ne]: user.id}}],            
                }
            }          

            let users = await User.findAndCountAll(Searchattributes);

            const response = getPagingData(users, page, limit);


            res.status(200).json({
                message: "User profile was retrieved successfully!",
                data: response
            });
            return;

        }

        res.status(404).send({
            message: "User profile not found!"
        });

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving the User."
        });
    }

}