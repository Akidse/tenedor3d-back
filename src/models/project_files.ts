import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({ options: { customName: 'ProjectFiles' }})
export class ProjectFilesClass extends TimeStamps {
    @prop()
    public name!: string;

    @prop()
    public project_id!: string;

    @prop()
    public folder_id!: string;

    @prop()
    public filename!: string;

    @prop()
    public original_filename!: string;

    @prop()
    public preview_path!: string;

    @prop()
    public type!: string;
}

const ProjectFilesModel = getModelForClass(ProjectFilesClass);

export default ProjectFilesModel;