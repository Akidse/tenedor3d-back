import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({ options: { customName: 'Users' }})
export class UsersClass extends TimeStamps {
    @prop()
    public email?: string;

    @prop()
    public institution_id?: string;

    @prop()
    public type?: 'student' | 'teacher';

    @prop()
    public first_name?: string;

    @prop()
    public last_name?: string;

    @prop()
    public second_name?: string;

    @prop()
    public password_hash?: string;
}

const UsersModel = getModelForClass(UsersClass);

export default UsersModel;