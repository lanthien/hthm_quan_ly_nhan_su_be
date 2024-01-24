import { DataException } from "../models/data_exception";
import PositionModel, { PositionModelType } from "../models/position_model";

export default class PositionDAO {
    getAllPositions() : Promise<Array<PositionModelType>> {
        return PositionModel.find({isActive : true}).exec()
    }

    async addPosition(titleName: String) : Promise<PositionModelType> {
        const model = await PositionModel.findOne({name : titleName});
        if (model != null) {
            throw new DataException('Chức vụ đã tồn tại');
        }
        const newPosition = new PositionModel({name: titleName, isActive: true});
        return await newPosition.save();
    }

    async updatePosition(id: String, newData: Object) : Promise<PositionModelType | null | Error> {
        const query = { _id : id }
        const model = await PositionModel.findOneAndUpdate(query, newData)
        if (model == null) {
            throw new DataException('Chức vụ không tồn tại');
        }
        return model;
    }
}