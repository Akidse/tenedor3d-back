import { Application } from "express";
import UsersModel from "../models/users";
import { generateAccessToken } from "../utils/utils";
var passwordHash = require('password-hash');

export default (app: Application) => {
    app.post('/api/auth', async (req, res) => {
        let user = await UsersModel.findOne({email: req.body.email});

        if(!user)
            return res.status(500).send({'type': 'USER_NOT_FOUND'});
        
        if(!passwordHash.verify(req.body.password, user.password_hash))
            return res.status(500).send({'type': 'USER_NOT_FOUND'});

        let token = generateAccessToken({_id: user._id, email: user.email});

        return res.json({
            token: token
        });
    });

    app.post('/api/registration', async (req, res) => {
        if(!req.body.email || !req.body.password)
            return res.status(500).send({'type': 'INVALID_DATA'});

        let usersWithSameEmail = await UsersModel.find({email: req.body.email});

        if(usersWithSameEmail && usersWithSameEmail.length)
            return res.status(500).send({'type': 'USER_WITH_EMAIL_EXISTS'});

        let hashedPassword = passwordHash.generate(req.body.password);
        let user = await UsersModel.create({
            email: req.body.email,
            password_hash: hashedPassword,
        });

        let token = generateAccessToken({_id: user._id, type: user.type});

        return res.json({
            token: token,
            user: {
                _id: user._id,
                email: req.body.email,
            }
        });
    });
}