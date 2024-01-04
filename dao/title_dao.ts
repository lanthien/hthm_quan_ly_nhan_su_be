import TitleModel, { TitleModelType } from "../models/title_model";

export default class TitleDAO {
    getAllTitle() : Promise<Array<TitleModelType>> {
        return TitleModel.find({})
    }

    async addTitle(titleName: String) : Promise<TitleModelType> {
        const model = TitleModel.findOneAndUpdate({name : titleName}, { isActive : true });
        if (model != null) {
            throw new Error('Chức danh đã tồn tại');
        }
        const newPosition = new TitleModel(titleName);
        return await newPosition.save();
    }

    async updateTitle(id: String, newData: Object) : Promise<TitleModelType | null> {
        const query = { _id : id }
        return await TitleModel.findOneAndUpdate(query, newData, { new: true })
    }
}