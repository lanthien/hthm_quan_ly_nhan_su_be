import DepartmentModel, {
  DepartmentModelType,
} from "../models/department_model";

export default class DepartmentDAO {
  getAllDepartments(): Promise<Array<DepartmentModelType>> {
    return DepartmentModel.find({ isActive: true }).exec();
  }

  async addDepartment(titleName: String): Promise<DepartmentModelType> {
    const newDepartmentModel = new DepartmentModel({
      name: titleName,
      isActive: true,
    });
    return await newDepartmentModel.save();
  }

  async updateDepartment(
    id: String,
    newData: Object
  ): Promise<DepartmentModelType | null> {
    const query = { _id: id };
    return await DepartmentModel.findOneAndUpdate(query, newData);
  }

  async searchDepartments(req: any, res: any) {
    try {
      let query: String = req.query.query as String;
      let deparments = await DepartmentModel.find({
        name: { $regex: query },
      }).exec();
      res.status(200).json(deparments);
    } catch (error: any) {
      res.status(400).send({ error: error.name, message: error.message });
    }
  }
}
