import { model, Schema, InferSchemaType  } from 'mongoose';
import MemberModel from './member_model';

const schema = new Schema({
    username: String,
    password: String,
    loginAt: Date,
    logoutAt: Date,
    createAt: Date,
    profile: { type: Schema.Types.ObjectId, ref: MemberModel }
})

export type LoginModelType = InferSchemaType<typeof schema>
const LoginModel = model('LoginModel', schema)
export default LoginModel