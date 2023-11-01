import TitleModel, { TitleModelType } from "../models/title_model";

export default class TitleDAO {
    getAllTitle() : Promise<Array<TitleModelType>> {
        return TitleModel.find({})
    }

    async addTitle(titleName: String) : Promise<TitleModelType> {
        const newTitle = new TitleModel(titleName);
        return await newTitle.save()
    }
}