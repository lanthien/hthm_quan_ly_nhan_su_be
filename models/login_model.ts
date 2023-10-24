import  { model, Schema, InferSchemaType, Types  } from 'mongoose';

const schema = new Schema({
    username: String,
    password: String,
    loginAt: Date,
    logoutAt: Date,
    role: String,
    profile: { type: Types.ObjectId, ref: 'MemberModel' }
});

export type LoginModelType = InferSchemaType<typeof schema>;
const LoginModel = model('LoginModel', schema);
export default LoginModel;