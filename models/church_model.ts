import { InferSchemaType, Schema, model, models } from "mongoose";

const ChurchSchema = new Schema({
  name: { type: String, unique: true, required: true },
  address: { type: String, required: true },
  createAt: Date,
  isActive: { type: Boolean, default: true },
});

export type ChurchModelType = InferSchemaType<typeof ChurchSchema>;
const ChurchModel = model("ChurchModel", ChurchSchema);
export default models.ChurchModel || ChurchModel;
