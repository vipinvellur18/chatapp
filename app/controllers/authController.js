const db = require('../models');
const Auth = db.auth;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async  function(req, res) {

    try{

        await Auth.findOne({where: {username: req.body.username}})
            .then(user => {
                if(user){
                    res.status(400).send({
                        message: "Failed! Username is already in use!"
                    });
                    return;
                }
            }
        );

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const auth = {
            username: req.body.username,
            password: hashedPassword,
            last_login: new Date(),
            status: 'ACTIVE'
        };

        await Auth.create(auth).then(data => {
            res.status(200).json({
                message: "User was registered successfully!",
                data: data
            });
        }
        ).catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Auth."
            });
        }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Auth."
        });
    }

}


exports.login = async function(req, res) {

    try{

        await Auth.findOne({where: {username: req.body.username}})
            .then(user => {
                if(!user){
                    res.status(400).send({
                        message: "Failed! Username is not found!"
                    });
                    return;
                }

                const passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if(!passwordIsValid){
                    res.status(401).json({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                    return;
                }

                const token = jwt.sign({id: user.id}, process.env.AUTHSECRET, {
                    expiresIn: 31536000
                });

                res.status(200).json({
                    id: user.id,
                    username: user.username,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    last_login: user.last_login,
                    token: token
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Auth."
        });
    }

}


exports.me = async function(req, res) {

    try{

        await Auth.findOne({where: {id: req.user.id}})
            .then(user => {
                if(!user){
                    res.status(400).send({
                        message: "Failed! Username is not found!"
                    });
                    return;
                }

                res.status(200).json({
                    id: user.id,
                    username: user.username,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    last_login: user.last_login
                });
            }
        );

    }

    catch(err){
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Auth."
        });
    }

}