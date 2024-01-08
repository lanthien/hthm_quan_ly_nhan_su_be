import DepartmentModel, { DepartmentModelType } from "../models/department_model";

export default class DepartmentDAO {
    getAllDepartments() : Promise<Array<DepartmentModelType>> {
        return DepartmentModel.find({isActive: true}).exec()
    }

    async addDepartment(titleName: String) : Promise<DepartmentModelType> {
        const departmentModel = await DepartmentModel.findOne({name : titleName});
        if (departmentModel != null) {
            throw new Error('Ban ngành đã tồn tại');
        }
        const newDepartmentModel= new DepartmentModel({name : titleName, isActive: true});
        return await newDepartmentModel.save();
    }

    async updateDepartment(id: String, newData: Object) : Promise<DepartmentModelType | null> {
        const query = { _id : id }
        return await DepartmentModel.findOneAndUpdate(query, newData)
    }
}