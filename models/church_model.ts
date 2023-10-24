import { InferSchemaType, Schema, model, models } from "mongoose";

const ChurchSchema = new Schema({
    name: String,
    address: String,
    createAt: Date,
    isActive: Boolean
});

export type ChurchModelType = InferSchemaType<typeof ChurchSchema>;
const ChurchModel = model('ChurchModel', ChurchSchema);
export default models.ChurchModel || ChurchModel;