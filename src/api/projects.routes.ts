import { Application } from "express";
import ProjectFoldersModel from "../models/project_folders";
import ProjectsModel from "../models/projects";
import authenticateToken from "./middlewares/authenticateToken.middleware";
import ProjectFilesModel from "../models/project_files";
import fs from 'fs';
import path from 'path';
import multer from "multer";
import { generateRandomString } from "../utils/utils";

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./static/projects"); // here we specify the destination . in this case i specified the current directory
    },
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, generateRandomString(5)+file.originalname+'.png');// here we specify the file saving name . in this case i specified the original file name
    }
});

let uploadDisk = multer({storage: storage, limits: {fieldSize: 25 * 1024 * 1024}});

export default (app: Application) => {

    app.get('/api/projects', authenticateToken, async (req, res) => {
        if(!req.query.userId) {
            const projects = await ProjectsModel.find();
            return res.json(projects);
        }

        const projects = await ProjectsModel.find({user_id: req.query.userId as string});

        return res.json(projects);
    });

    app.get('/api/project', authenticateToken, async (req, res) => {
        if(!req.query.projectId)
            return res.status(500).send({'type': 'INVALID_INPUT'});

        const project = await ProjectsModel.findById(req.query.projectId);

        if(!project)
            return res.status(500).send({'type': 'PROJECT_NOT_FOUND'});

        const folders = await ProjectFoldersModel.find({project_id: project._id});
        const files = await ProjectFilesModel.find({project_id: project._id});

        let sceneData = {};
        if(fs.existsSync('./static/projects/'+project._id+'.json')) {
            const data = fs.readFileSync('./static/projects/'+project._id+'.json', 'utf8');
            sceneData = JSON.parse(JSON.parse(data));
        }

        return res.json({
            ...project.toObject(),
            folders,
            files,
            sceneData,
        });
    });

    app.put('/api/project', [authenticateToken, uploadDisk.single('scenePreviewImage')], async (req, res) => {
        if(!req.file || !req.body.projectId)
            return res.status(500).send({'type': 'INVALID_INPUT'});

        const project = await ProjectsModel.findById(req.body.projectId);

        if(!project)
            return res.status(500).send({'type': 'PROJECT_NOT_FOUND'});

        //saving project preview image
        fs.rename(req.file.path, './static/projects/'+project._id+'.png', function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });

        //saving project json file
        fs.writeFile(
            './static/projects/'+project._id+'.json',
            JSON.stringify(req.body.sceneData),
            (err) => {
                if (err) return console.log(err);
            }
        );

        return res.json({
            ...project.toObject(),
            sceneData: req.body.sceneData,
        });
    });

    app.post('/api/project', [authenticateToken, uploadDisk.single('scenePreviewImage')], async (req, res) => {
        if(!req.body.name || req.body.is_public === undefined || !req.file)
            return res.status(500).send({'type': 'INVALID_INPUT'});

        const project = await ProjectsModel.create({
            name: req.body.name,
            user_id: (req as any).user._id,
            is_public: req.body.is_public
        });

        //saving project preview image
        fs.rename(req.file.path, './static/projects/'+project._id+'.png', function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });

        //saving project json file
        fs.writeFile(
            './static/projects/'+project._id+'.json',
            JSON.stringify(req.body.sceneData),
            (err) => {
                if (err) return console.log(err);
            }
        );

        return res.json({
            ...project.toObject(),
            sceneData: req.body.sceneData,
        });
    });

    app.get('/api/user_projects', authenticateToken, async(req, res) => {
        const projects = await ProjectsModel.find({user_id: (req as any).user._id});
        return res.json(projects);
    });
}