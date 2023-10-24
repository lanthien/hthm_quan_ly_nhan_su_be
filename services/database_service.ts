import mongoose, { Schema, Model, PopulateOption } from 'mongoose';
import MemberModel, { MemberModelType } from '../models/member_model.ts'
import LoginModel, { LoginModelType } from '../models/login_model';
import { Console, error } from 'console';
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

    addNewMember(json: any) : LoginModelType {
        let memberModel = new MemberModel({
            ho_ten: json.ho_ten,
            chuc_danh: json.chuc_danh,
            chuc_vu: json.chuc_vu,
            ban_nganh: json.ban_nganh,
            gioi_tinh: json.gioi_tinh,
            dan_toc: json.dan_toc,
            ngay_sinh: json.ngay_sinh,
            dia_chi: json.dia_chi,
            thuong_tru: json.thuong_tru,
            hoi_thanh_sinh_hoat: json.hoi_thanh_sinh_hoat,
            hoi_thanh_quan_nhiem: json.hoi_thanh_quan_nhiem,
            ngay_xoa: json.ngay_xoa,
            ngay_tao: json.ngay_tao,
            ngay_cap_nhat: json.ngay_cap_nhat
        })
        memberModel.save()
        let loginModel = new LoginModel({
            username: json.username, 
            password: json.password, 
            profile: memberModel._id,
            createAt: Date()
        })
        loginModel.save()

        return loginModel
    }

    async getMembers(query?: Object) : Promise<Array<LoginModelType>> {
        try {
            if (query != null) {
                return LoginModel.find(query)
                .select('-password')
                .populate({
                    path: 'profile',
                    populate: [
                        { path: 'title' },
                        { path: 'position' },
                        { path: 'joiningChurchs' },
                        { path: 'churchOwner' }
                    ]
                })
                .exec();
            }
            return LoginModel.find()
            .select('-password')
            .populate({
                path: 'profile',
                populate: [
                    { path: 'title' },
                    { path: 'position' },
                    { path: 'joiningChurchs' },
                    { path: 'churchOwner' }
                ]
            })
            .exec()
        } catch {
            console.log(error)
            return []
        }
    }

    async deleteMember(query: Object) : Promise<LoginModelType | null> {
        return await LoginModel.findOneAndDelete(query)
    }
}