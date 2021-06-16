import { Application } from "express";
import multer from "multer";
import ProjectFilesModel from "../models/project_files";
import { generateRandomString } from "../utils/utils";
import authenticateToken from "./middlewares/authenticateToken.middleware";

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./static/projects_files"); // here we specify the destination . in this case i specified the current directory
    },
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, generateRandomString(5)+file.originalname);// here we specify the file saving name . in this case i specified the original file name
    }
});

let uploadDisk = multer({storage: storage});

export default (app: Application) => {

    app.post('/api/project_file', [authenticateToken, uploadDisk.single('file')], async (req, res) => {
        if(!req.body.name || !req.body.type || !req.file || !req.body.project_id)
            return res.status(500).send({'type': 'INVALID_INPUT'});

        const fileObj = await ProjectFilesModel.create({
            filename: req.file.filename,
            original_filename: req.file.originalname,
            name: req.body.name,
            type: req.body.type,
            project_id: req.body.project_id,
            folder_id: req.body.folder_id,
        });

        return res.json(fileObj);
    });
}