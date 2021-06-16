import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({ options: { customName: 'Projects' }})
export class ProjectsClass extends TimeStamps {
    @prop()
    public name!: string;
    
    @prop()
    public user_id!: string;

    @prop()
    public is_public!: string;
}

const ProjectsModel = getModelForClass(ProjectsClass);

export default ProjectsModel;