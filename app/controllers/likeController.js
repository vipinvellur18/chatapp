const db = require('../models');
const User = db.user;
const Like = db.like;
const Op = db.Sequelize.Op;
const {getPagination,getPagingData} = require('../helpers/pagination');

exports.createLike = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        const { postId } = req.body;

        let like = await Like.findOne({where: {userId: user.id, postId: postId}});

        if(like){
            res.status(400).send({
                message: "You have already liked this post!"
            });
            return;
        }

        const likeData = {
            userId: user.id,
            postId: postId
        };

        await Like.create(likeData).then(data => {
            res.status(200).json({
                message: "Like created successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while creating the like."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the like."
        });
    }

}

exports.deleteLike = async function(req, res) {

    try{

        let user = await User.findOne({where: {aid: req.user.id}});

        if(!user){
            res.status(400).send({
                message: "User not found!"
            });
            return;
        }

        const { id } = req.params;

        let like = await Like.findOne({where: {userId: user.id, postId: id}});

        if(!like){
            res.status(400).send({
                message: "You have not liked this post!"
            });
            return;
        }

        await Like.destroy({
            where: {
                userId: user.id,
                postId: id
            }
        }).then(data => {
            res.status(200).json({
                message: "Like deleted successfully!",
                data: data
            });
        }).catch(err => {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while deleting the like."
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while deleting the like."
        });
    }

}


exports.getLikes = async function(req, res) {

    try{

        const { id } = req.params;

        const page = req.query.page;
        const size = req.query.size;
        const { limit, offset } = getPagination(page, size);
        let  Searchattributes ={limit, offset};

        Searchattributes = {
            ...Searchattributes,
            where: {
                [Op.and]: [
                    {postId: id}, {status: "ACTIVE"}
                ]
            },
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: ['id', 'postId'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'profilePic']
                }
            ],
        }        

        let likes = await Like.findAndCountAll(Searchattributes);

        const response = getPagingData(likes, page, limit);

        if(!likes){
            res.status(400).send({
                message: "No likes found!"
            });
            return;
        }

        res.status(200).json({
            message: "Likes fetched successfully!",
            data: response
        });

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while fetching the likes."
        });
    }

}