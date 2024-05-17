import { InferSchemaType, Schema, Types, model, models } from "mongoose";

const ChurchPositionSchema = new Schema({
  position: { type: Types.ObjectId, ref: "PositionModel" },
  church: { type: Types.ObjectId, ref: "ChurchModel" },
});

export type ChurchPositionModelType = InferSchemaType<
  typeof ChurchPositionSchema
>;
const ChurchPositionModel = model("ChurchPositionModel", ChurchPositionSchema);
export default models.ChurchPositionModel || ChurchPositionModel;
