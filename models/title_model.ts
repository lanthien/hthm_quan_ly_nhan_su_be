import { InferSchemaType, Schema, model, models } from "mongoose";

const TitleSchema = new Schema({
  name: { type: String, unique: true, required: true },
  isActive: { type: Boolean, required: true },
});

export type TitleModelType = InferSchemaType<typeof TitleSchema>;
const TitleModel = model("TitleModel", TitleSchema);
export default models.TitleModel || TitleModel;
