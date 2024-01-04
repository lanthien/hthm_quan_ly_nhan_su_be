import { InferSchemaType, Schema, model, models } from "mongoose";

const DepartmentSchema = new Schema({
    name: String,
    address: String,
    isActive: Boolean,
});

export type DepartmentModelType = InferSchemaType<typeof DepartmentSchema>;
const DepartmentModel = model('DepartmentModel', DepartmentSchema);
export default DepartmentModel;