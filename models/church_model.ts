import { InferSchemaType, Schema, model, models } from "mongoose";
import { AddressType } from "./address_unit_model";

const ChurchSchema = new Schema({
  name: { type: String, unique: true, required: true },
  address: AddressType,
  createAt: Date,
  isActive: { type: Boolean, default: true },
});

export type ChurchModelType = InferSchemaType<typeof ChurchSchema>;
const ChurchModel = model("ChurchModel", ChurchSchema);
export default models.ChurchModel || ChurchModel;
