import { DataException } from "../models/data_exception";
import PositionModel, { PositionModelType } from "../models/position_model";

export default class PositionDAO {
    getAllPositions() : Promise<Array<PositionModelType>> {
        return PositionModel.find({}).exec()
    }

    async addPosition(titleName: String) : Promise<PositionModelType> {
        const model = PositionModel.findOneAndUpdate({name : titleName}, { isActive : true });
        if (model != null) {
            throw new DataException('Chức vụ đã tồn tại');
        }
        const newPosition = new PositionModel(titleName);
        return await newPosition.save();
    }

    async updatePosition(id: String, newData: Object) : Promise<PositionModelType | null | Error> {
        const query = { _id : id }
        const model = await PositionModel.findOneAndUpdate(query, newData, { new: true })
        if (model == null) {
            throw new DataException('Chức vụ không tồn tại');
        }
        return model;
    }
}