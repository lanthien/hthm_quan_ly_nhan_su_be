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
  tempAddress: String,
  permanentAddress: String,
  joiningChurchs: [{ type: Types.ObjectId, ref: "ChurchModel", default: [] }],
  churchOwner: [{ type: Types.ObjectId, ref: "ChurchModel", default: [] }],
  isActive: Boolean,
  familyMembers: [
    {
      type: {
        type: String,
        member: { type: Types.ObjectId, ref: "MemberModel" },
      },
    },
  ],
});

export type MemberModelType = InferSchemaType<typeof MemberModelSchema>;
const MemberModel = model("MemberModel", MemberModelSchema);
export default MemberModel;
