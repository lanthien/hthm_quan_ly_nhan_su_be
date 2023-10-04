import mongoose from 'mongoose';
import MemberModel from './member_model.js'
const { Schema, SchemaTypes } = mongoose;

const LoginModelSheme = new Schema({
    username: String,
    password: String,
    loginAt: { type: Date, default: '' },
    logoutAt: { type: Date, default: '' },
    profile: { type: SchemaTypes.ObjectId, ref: 'MemberModel' }
})

export default mongoose.model('LoginModel', LoginModelSheme)

