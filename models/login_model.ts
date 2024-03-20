import { model, Schema, InferSchemaType, Types } from "mongoose";

const schema = new Schema({
  username: { type: String, required: false },
  password: { type: String, required: false },
  loginAt: { type: Date, required: false },
  logoutAt: { type: Date, required: false },
  roles: {
    type: [
      {
        type: String,
        enum: ["admin", "reader", "writer"],
      },
    ],
    default: ["reader"],
  },
  accessToken: { type: String, required: false },
  refreshToken: { type: String, required: false },
  isActive: { type: Boolean, require: true, default: true },
  profile: { type: Types.ObjectId, ref: "MemberModel" },
});

export type LoginModelType = InferSchemaType<typeof schema>;
const LoginModel = model("LoginModel", schema);
export default LoginModel;
