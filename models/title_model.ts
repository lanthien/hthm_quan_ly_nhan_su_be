import { InferSchemaType, Schema, model, models } from "mongoose";

const TitleSchema = new Schema({
    name: String
});

export type TitleModelType = InferSchemaType<typeof TitleSchema>;
const TitleModel = model('TitleModel', TitleSchema);
export default models.TitleModel || TitleModel;