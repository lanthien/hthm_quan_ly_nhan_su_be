import PositionModel, { PositionModelType } from "../models/position_model";

export default class PositionDAO {
    getAllPositions() : Promise<Array<PositionModelType>> {
        return PositionModel.find({}).exec()
    }

    async addPosition(titleName: String) : Promise<PositionModelType> {
        const newPosition = new PositionModel(titleName);
        return await newPosition.save()
    }
}