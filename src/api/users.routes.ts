import { Application } from "express";
import InstitutionsModel from "../models/institutions";
import UsersModel from "../models/users";
import authenticateToken from "./middlewares/authenticateToken.middleware";

export default (app: Application) => {
    app.get('/api/user', authenticateToken, async (req: any, res) => {
        let user = await UsersModel.findById(req.user._id);
        if(!user)
            return res.status(403).send({'type': 'USER_NOT_FOUND'});

        return res.json({
            _id: user._id,
            email: user.email,
        });
    });
}