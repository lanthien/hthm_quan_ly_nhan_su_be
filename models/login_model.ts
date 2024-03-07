import { model, Schema, InferSchemaType, Types } from "mongoose";

const schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  loginAt: { type: Date, required: false },
  logoutAt: { type: Date, required: false },
  role: {
    type: String,
    enum: ["admin", "reader", "writer"],
    default: "reader",
  },
  accessToken: { type: String, required: false },
  refreshToken: { type: String, required: false },
  isActive: { type: Boolean, require: true, default: true },
  profile: { type: Types.ObjectId, ref: "MemberModel", require: false },
});

export type LoginModelType = InferSchemaType<typeof schema>;
const LoginModel = model("LoginModel", schema);
export default LoginModel;
