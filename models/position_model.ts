import { InferSchemaType, Schema, model, models } from "mongoose";

const PositionSchema = new Schema({
    name: String
});

export type PositionModelType = InferSchemaType<typeof PositionSchema>;
const PositionModel = model('PositionModel', PositionSchema);
export default models.PositionModel || PositionModel;