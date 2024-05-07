import { title } from "process";
import TitleModel, { TitleModelType } from "../models/title_model";

export default class TitleDAO {
  getAllTitle(): Promise<Array<TitleModelType>> {
    return TitleModel.find({ isActive: true });
  }

  async addTitle(titleName: String): Promise<TitleModelType> {
    const model = await TitleModel.findOne({ name: titleName });
    if (model != null) {
      throw new Error("Chức danh đã tồn tại");
    }
    const newPosition = new TitleModel({ name: titleName, isActive: true });
    return await newPosition.save();
  }

  async updateTitle(
    id: String,
    newData: Object
  ): Promise<TitleModelType | null> {
    const query = { _id: id };
    return await TitleModel.findOneAndUpdate(query, newData);
  }

  async searchTitles(req: any, res: any) {
    try {
      let query: String = req.query.query as String;
      let titles = await TitleModel.find({
        name: { $regex: query },
      }).exec();
      res.status(200).json(titles);
    } catch (error: any) {
      res.status(400).send({ error: error.name, message: error.message });
    }
  }
}
