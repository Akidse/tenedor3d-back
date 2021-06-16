import { Application } from "express";
import ProjectFoldersModel from "../models/project_folders";
import authenticateToken from "./middlewares/authenticateToken.middleware";

export default (app: Application) => {

    app.post('/api/project_folder', authenticateToken, async (req, res) => {
        if(!req.body.name || !req.body.project_id)
            return res.status(500).send({'type': 'INVALID_INPUT'});

        const folder = await ProjectFoldersModel.create({
            name: req.body.name,
            project_id: req.body.project_id,
        });

        return res.json(folder);
    });
}