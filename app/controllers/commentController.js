const db = require("../models");
const Comment = db.comment;
const User = db.user;
const Post = db.post;
const Replay = db.replay;
const { getPagination, getPagingData } = require("../helpers/pagination");
const Op = db.Sequelize.Op;

exports.createComment = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let post = await Post.findOne({where: {id: req.params.id}});

        if(!post){
            res.status(400).send({
                message: "Post not found!"
            });
            return;
        }

        const commentData = {
            userId: user.id,
            postId: post.id,
            comment: req.body.comment
        };

        await Comment.create(commentData).then(data => {
            res.status(200).json({
                message: "Comment created successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the comment."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the comment."
        });
    }

}

exports.getComments = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let post = await Post.findOne({where: {id: req.params.id}});

        if(!post){
            res.status(400).send({
                message: "Post not found!"
            });
            return;
        }

        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);

        await Comment.findAndCountAll({
            where: {
                postId: post.id
            },
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ],
            distinct: true,
            attributes: ['id', 'comment', 'createdAt'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'profilePic']
                },
                {
                    model: Replay,
                    attributes: ['id', 'replay'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email', 'profilePic']
                        }
                    ]
                }
            ]
        }).then(data => {
            const response = getPagingData(data, page, limit);
            res.status(200).json({
                message: "Comments retrieved successfully!",
                data: response
            });
        }).catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving comments."
            });
        });

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving comments."
        });
    }

}

exports.createReply = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let comment = await Comment.findOne({where: {id: req.params.id}});

        if(!comment){
            res.status(400).send({
                message: "Comment not found!"
            });
            return;
        }

        const commentData = {
            userId: user.id,
            commentId: comment.id,
            replay: req.body.comment
        };

        console.log(commentData)

        await Replay.create(commentData).then(data => {
            res.status(200).json({
                message: "Reply created successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the reply."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the reply."
        });
    }

}

exports.getReplies = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let comment = await Comment.findOne({where: {id: req.params.id}});

        if(!comment){
            res.status(400).send({
                message: "Comment not found!"
            });
            return;
        }

        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);

        await Replay.findAndCountAll({
            where: {
                commentId: comment.id
            },
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC']
            ],
            distinct: true,
            attributes: ['id', 'replay', 'createdAt'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'profilePic']
                }
            ]
        }).then(data => {
            const response = getPagingData(data, page, limit);
            res.status(200).json({
                message: "Replies retrieved successfully!",
                data: response
            });
        }).catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving replies."
            });
        });

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving replies."
        });
    }

}

exports.deleteComment = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let comment = await Comment.findOne({
            where: {
                [Op.and]: [
                    {id: req.params.id},
                    {userId: user.id}
                ]
            }
        });

        if(!comment){
            res.status(400).send({
                message: "Comment not found!"
            });
            return;
        }

        await Comment.destroy({
            where: {
                id: comment.id
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).json({
                    message: "Comment deleted successfully!"
                });
            } else {
                res.status(400).json({
                    message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`
                });
            }
        }).catch(err => {
            res.status(500).json({
                message: "Could not delete Comment with id=" + id
            });
        });

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while deleting the comment."
        });
    }

}

exports.deleteReply = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        let reply = await Replay.findOne({
            where: {
                id: req.params.id
            }
        });

        if(!reply){
            res.status(400).send({
                message: "Reply not found!"
            });
            return;
        }

        if(reply){
            
            let comment = await Comment.findOne({
                where: {
                    [Op.and]: [
                        {id: reply.commentId}
                    ]
                }
            });

            console.log(user.id, comment.userId , reply.userId)

            if(comment.userId !== user.id && reply.userId !== user.id){
                res.status(400).send({
                    message: "Reply not found!",
                });
                return;
            }
        }


        await Replay.destroy({
            where: {
                id: reply.id
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).json({
                    message: "Reply deleted successfully!"
                });
            } else {
                res.status(400).json({
                    message: `Cannot delete Reply with id=${id}. Maybe Reply was not found!`
                });
            }
        }
        ).catch(err => {
            res.status(500).json({
                message: "Could not delete Reply with id=" + id
            });
        }
        );

    }
    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while deleting the reply."
        });
    }

}