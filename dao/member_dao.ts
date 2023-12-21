import { error } from "console"
import LoginModel, { LoginModelType } from "../models/login_model"
import MemberModel from "../models/member_model"

export default class MemberDAO {
    addNewMember(json: any) : LoginModelType {
        let memberModel = new MemberModel({
            name: json.name,
            phoneNumer: json.phoneNumer,
            personalId: json.personalId,
            title: json.title,
            position: json.position,
            department: json.department,
            genre: json.genre,
            national: json.national,
            birthday: json.birthday,
            tempAddress: json.tempAddress,
            permanentAddress: json.permanentAddress,
            joiningChurchs:  json.joiningChurchs == null || json.joiningChurchs.toString().length === 0 
                                ? undefined 
                                : json.joiningChurchs.toString().split(','),
            churchOwner: json.churchOwner ?? undefined,
            updateAt: new Date().getMilliseconds(),
            createAt: new Date().getMilliseconds(),
            isActive: true,
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
                        { path: 'churchOwner' },
                        { path: 'department' }
                    ],
                    
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
                    { path: 'churchOwner' },
                    { path: 'department' }
                ]
            })
            .exec()
        } catch {
            console.log(error)
            return []
        }
    }
    
    async deleteMember(query: Object) : Promise<LoginModelType | null> {
        return await LoginModel.findOneAndUpdate(query, {isActive: false})
    }

    async updateMember(member: any) {
        await LoginModel.updateOne({_id : member.id}, member);
    }
}