import ChurchModel, { ChurchModelType } from "../models/church_model";

export default class ChurchDAO {
  getAllChurchs(): Promise<Array<ChurchModelType>> {
    return ChurchModel.find({ isActive: true }).exec();
  }

  async addChurch(
    titleName: String,
    address: Object
  ): Promise<ChurchModelType> {
    const newPosition = new ChurchModel({
      name: titleName,
      address: address,
      createAt: new Date().getTime(),
    });
    return await newPosition.save();
  }

  async updateChurch(
    id: String,
    newData: Object
  ): Promise<ChurchModelType | null> {
    const query = { _id: id };
    return await ChurchModel.findOneAndUpdate(query, newData);
  }

  async searchChurchs(req: any, res: any) {
    try {
      let query: String = req.query.query as String;
      let churchs = await ChurchModel.find({
        $or: [
          { name: { $regex: query } },
          { "address.houseNumber": { $regex: query } },
          { "address.province.name": { $regex: query } },
          { "address.district.name": { $regex: query } },
          { "address.commune.name": { $regex: query } },
        ],
      }).exec();
      res.status(200).json(churchs);
    } catch (error: any) {
      res.status(400).send({ error: error.name, message: error.message });
    }
  }
}
