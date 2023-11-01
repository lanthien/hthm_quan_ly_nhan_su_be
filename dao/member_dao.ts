import { error } from "console"
import LoginModel, { LoginModelType } from "../models/login_model"
import MemberModel from "../models/member_model"

export default class MemberDAO {
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