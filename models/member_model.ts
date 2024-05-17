import { model, InferSchemaType, Schema, Types } from "mongoose";
import { AddressType } from "./address_unit_model";

var MemberModelSchema = new Schema({
  name: String,
  avatarImage: { type: String, require: false },
  phoneNumber: String,
  personalId: String,
  title: { type: Types.ObjectId, ref: "TitleModel" },
  genre: String,
  national: String,
  birthday: { type: Date, trim: true },
  tempAddress: AddressType,
  permanentAddress: AddressType,
  churchPositions: [{ type: Types.ObjectId, ref: "ChurchPositionModel" }],
  familyMembers: [
    {
      relationshipType: {
        type: String,
        enum: ["husband", "wife", "brother", "sister", "child", "none"],
      },
      member: { type: Types.ObjectId, ref: "LoginModel" },
    },
  ],
});

export type MemberModelType = InferSchemaType<typeof MemberModelSchema>;
const MemberModel = model("MemberModel", MemberModelSchema);
export default MemberModel;
