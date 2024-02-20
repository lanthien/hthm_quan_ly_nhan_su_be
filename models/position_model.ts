import { InferSchemaType, Schema, model, models } from "mongoose";

const PositionSchema = new Schema({
  name: { type: String, unique: true, required: true },
  isActive: { type: Boolean, required: true },
});

export type PositionModelType = InferSchemaType<typeof PositionSchema>;
const PositionModel = model("PositionModel", PositionSchema);
export default models.PositionModel || PositionModel;
