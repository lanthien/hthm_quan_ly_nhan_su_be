import {model, InferSchemaType, Schema, Types} from 'mongoose';
import TitleModel from './title_model';
import DepartmentModel from './department_model';
import PositionModel from './position_model';
import ChurchModel from './church_model';

var MemberModelSchema = new Schema({
    name: String,
    title: { type: Types.ObjectId, ref: 'TitleModel' },
    position: { type: Types.ObjectId, ref: 'PositionModel' },
    department: { type: Types.ObjectId, ref: 'DepartmentModel' },
    genre: String,
    national: String,
    birthday: String,
    tempAddress: String,
    permanentAddress: String,
    joiningChurchs: [{ type: Types.ObjectId, ref: 'ChurchModel', default: [] }],
    churchOwner: { type: Types.ObjectId, ref: 'ChurchModel' },
    isActive: Boolean,
    createAt: Date,
    updateAt: Date,
    // userUpdate: { type: Schema.Types.ObjectId, ref: 'LoginModel' }
});

export type MemberModelType = InferSchemaType<typeof MemberModelSchema>;
const MemberModel = model('MemberModel', MemberModelSchema);
export default MemberModel;