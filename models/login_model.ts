import  { model, Schema, InferSchemaType, Types  } from 'mongoose';

const schema = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    loginAt: Date,
    logoutAt: Date,
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    profile: { type: Types.ObjectId, ref: 'MemberModel' }
});

export type LoginModelType = InferSchemaType<typeof schema>;
const LoginModel = model('LoginModel', schema);
export default LoginModel;