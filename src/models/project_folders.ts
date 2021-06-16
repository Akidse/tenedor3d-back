import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({ options: { customName: 'ProjectFolders' }})
export class ProjectFoldersClass extends TimeStamps {

    @prop()
    public name!: string;

    @prop()
    public project_id!: string;
}

const ProjectFoldersModel = getModelForClass(ProjectFoldersClass);

export default ProjectFoldersModel;