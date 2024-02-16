import mongoose, { Schema, Model, PopulateOption } from "mongoose";
import MemberModel, { MemberModelType } from "../models/member_model.ts";
import LoginModel, { LoginModelType } from "../models/login_model";
import ChurchModel from "../models/church_model.ts";
import DepartmentModel from "../models/department_model.ts";
import PositionModel from "../models/position_model.ts";
import TitleModel from "../models/title_model.ts";
var dbName = "quan_ly_nhan_su_db";
var url =
  "mongodb+srv://lanthiendiep:HoiThanhHocMon%402024@serverlessinstance0.mx6otzy.mongodb.net/?retryWrites=true&w=majority";

export default class DatabaseService {
  constructor() {}

  async initialDatabase() {
    const db = mongoose.connection;
    mongoose.connect(url);
    await LoginModel.createCollection();
    await MemberModel.createCollection();
    await ChurchModel.createCollection();
    await DepartmentModel.createCollection();
    await PositionModel.createCollection();
    await TitleModel.createCollection();
  }
}
