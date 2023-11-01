import mongoose, { Schema, Model, PopulateOption } from 'mongoose';
import MemberModel, { MemberModelType } from '../models/member_model.ts'
import LoginModel, { LoginModelType } from '../models/login_model';
import ChurchModel from '../models/church_model.ts';
import DepartmentModel from '../models/department_model.ts';
import PositionModel from '../models/position_model.ts';
import TitleModel from '../models/title_model.ts';
var dbName = 'quan_ly_nhan_su_db'
var url = 'mongodb://localhost:27017/'

export default class DatabaseService {
    constructor(){}

    async initialDatabase() {
        const db = mongoose.connection;
        mongoose.connect('mongodb://127.0.0.1:27017/test')
        await LoginModel.createCollection()
        await MemberModel.createCollection()
        await ChurchModel.createCollection()
        await DepartmentModel.createCollection()
        await PositionModel.createCollection()
        await TitleModel.createCollection()
    }
}