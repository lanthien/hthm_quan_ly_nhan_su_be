import { model, Schema, InferSchemaType, Types } from "mongoose";

const schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  loginAt: { type: Date, required: false },
  logoutAt: { type: Date, required: false },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  permissions: { type: [String], enum: ["read", "write"], require: false },
  accessToken: { type: String, required: false },
  refreshToken: { type: String, required: false },
});

export type LoginModelType = InferSchemaType<typeof schema>;
const LoginModel = model("LoginModel", schema);
export default LoginModel;
