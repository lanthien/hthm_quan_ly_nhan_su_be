import { model, InferSchemaType, Schema, Types } from "mongoose";

var MemberModelSchema = new Schema({
  name: String,
  avatarImage: { type: String, require: false },
  phoneNumer: String,
  personalId: String,
  title: { type: Types.ObjectId, ref: "TitleModel" },
  position: { type: Types.ObjectId, ref: "PositionModel" },
  department: { type: Types.ObjectId, ref: "DepartmentModel" },
  genre: String,
  national: String,
  birthday: { type: Date, trim: true },
  tempAddress: {
    type: { address: String, province: String, district: String, city: String },
    required: false,
  },
  permanentAddress: {
    type: { address: String, province: String, district: String, city: String },
    required: false,
  },
  joiningChurchs: [{ type: Types.ObjectId, ref: "ChurchModel", default: [] }],
  churchOwner: [{ type: Types.ObjectId, ref: "ChurchModel", default: [] }],
  familyMembers: [
    {
      type: {
        type: String,
        member: { type: String, ref: "LoginModel" },
      },
    },
  ],
});

export type MemberModelType = InferSchemaType<typeof MemberModelSchema>;
const MemberModel = model("MemberModel", MemberModelSchema);
export default MemberModel;
