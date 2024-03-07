import { InferSchemaType, Schema, model, models } from "mongoose";

const ChurchSchema = new Schema({
  name: { type: String, unique: true, required: true },
  address: {
    type: { address: String, province: String, district: String, city: String },
    required: false,
  },
  createAt: Date,
  isActive: { type: Boolean, default: true },
});

export type ChurchModelType = InferSchemaType<typeof ChurchSchema>;
const ChurchModel = model("ChurchModel", ChurchSchema);
export default models.ChurchModel || ChurchModel;
