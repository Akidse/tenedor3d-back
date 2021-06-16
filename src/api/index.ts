import bodyParser from "body-parser";
import cors from 'cors';
import express, { Application } from 'express';
import helmet from "helmet";
import morgan from "morgan";
import authenticationRoutes from "./authentication.routes";
import projectsRoutes from "./projects.routes";
import project_filesRoutes from "./project_files.routes";
import project_foldersRoutes from "./project_folders.routes";
import usersRoutes from "./users.routes";
import formData from 'express-form-data';

export default (): Application => {
    const app: Application = express();
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(cors());
    app.use(morgan('combined'));
    //app.use(formData.parse());

    app.use('/static', express.static('static'));
    authenticationRoutes(app);
    usersRoutes(app);
    projectsRoutes(app);
    project_foldersRoutes(app);
    project_filesRoutes(app);
    return app;
}