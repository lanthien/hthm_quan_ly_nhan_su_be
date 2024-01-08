import { InferSchemaType, Schema, model, models } from "mongoose";

const DepartmentSchema = new Schema({
    name: {type: String, required: true},
    isActive: {type: Boolean, required: true},
});

export type DepartmentModelType = InferSchemaType<typeof DepartmentSchema>;
const DepartmentModel = model('DepartmentModel', DepartmentSchema);
export default DepartmentModel;