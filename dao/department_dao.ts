import DepartmentModel, { DepartmentModelType } from "../models/department_model";

export default class DepartmentDAO {
    getAllDepartments() : Promise<Array<DepartmentModelType>> {
        return DepartmentModel.find({}).exec()
    }

    async addDepartment(titleName: String) : Promise<DepartmentModelType> {
        const newPosition = new DepartmentModel(titleName);
        return await newPosition.save()
    }

    async updateDepartment(id: String, newData: Object) : Promise<DepartmentModelType | null> {
        const query = { _id : id }
        return await DepartmentModel.findOneAndUpdate(query, newData, { new: true })
    }
}