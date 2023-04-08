const db = require("../models");
const Auth = db.auth;
const User = db.user;
const Post = db.post;
const PostTag = db.postTag;
const Op = db.Sequelize.Op;
const Like = db.like;
const Follow = db.follow;
const { getPagination, getPagingData } = require("../helpers/pagination");

exports.createPost = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        const postData = {
            userId: user.id,
            title: req.body.title,
            content: req.body.content
        };

        await Post.create(postData).then(data => {
            res.status(200).json({
                message: "Post created successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the post."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the post."
        });
    }

}


exports.tagCreate = async function(req, res) {

    try{

        const { userId } = req.body;

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let post = await Post.findOne({
            where:{
                [Op.and]: [{userId: user.id}, {id: req.params.id}]
            }
        });

        if(!post){
            res.status(400).send({
                message: "Post not found!"
            });
            return;
        }
        
        userId.forEach(async (user) => {

            let postTag = await PostTag.findOne({where: {userId: user, postId: req.params.id}});

            let allPostTags = await PostTag.findAll({where: {postId: req.params.id}});

            let allPostTagUser = [];
            if(allPostTags.length > 0){
                await allPostTags.forEach(async (postTag) => {
                    allPostTagUser.push(postTag.userId);
                })
            }

            if(allPostTagUser.length > 0){
                allPostTagUser.forEach(async (user) => {
                    if(!userId.includes(user)){
                        await PostTag.destroy({where: {userId: user, postId: req.params.id}});
                    }
                })
            }

            if(!postTag){
                await PostTag.create({
                    userId: user,
                    postId: req.params.id
                })
            }

        })

        res.status(200).json({
            message: "Post tagged successfully!",
        });

    }
    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while tagging the post."
        });
    }

}


exports.getPosts = async function(req, res) {

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
            where: {
                userId: user.id,
            },
            order: [
                ['createdAt', 'DESC']
            ],
        }       

        await Post.findAndCountAll(
            Searchattributes
        ).then(data => {
            const response = getPagingData(data, page, limit);
            res.status(200).json({
                message: "Posts fetched successfully!",
                data: response
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while fetching posts."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while fetching posts."
        });
    }

}

exports.viewPost = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        await Post.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: PostTag,
                    attributes: ['id'],
                    include : [
                        {
                            model: User
                        }
                    ]
                },
            ]
        }).then(data => {
            res.status(200).json({
                message: "Post fetched successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while fetching post."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while fetching post."
        });
    }

}

exports.listTagPost = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        console.log(req.user.id)

        await PostTag.findAll({
            where: {
                userId: user.id
            },
            attributes: ['id'],
            include: [
                {
                    model: Post,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email', 'profilePic']
                        },
                        {
                            model: PostTag,
                            attributes: ['id'],
                            include : [
                                {
                                    model: User,
                                    attributes: ['id', 'name', 'email', 'profilePic']
                                }
                            ]
                        }
                    ]
                }
            ]
        }).then(data => {
            res.status(200).json({
                message: "Post fetched successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while fetching post."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while fetching post."
        });
    }

}