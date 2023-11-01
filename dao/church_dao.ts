import ChurchModel, { ChurchModelType } from "../models/church_model";

export default class ChurchDAO {
    getAllChurchs() : Promise<Array<ChurchModelType>> {
        return ChurchModel.find({}).exec()
    }

    async addChurch(titleName: String) : Promise<ChurchModelType> {
        const newPosition = new ChurchModel(titleName);
        return await newPosition.save()
    }

    async updateChurch(id: String, newData: Object) : Promise<ChurchModelType | null> {
        const query = { _id : id }
        return await ChurchModel.findOneAndUpdate(query, newData, { new: true })
    }
}