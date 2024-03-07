import { error } from "console";
import MemberModel, { MemberModelType } from "../models/member_model";
import LoginModel, { LoginModelType } from "../models/login_model";

export default class MemberDAO {
  addNewMember(json: any): MemberModelType {
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
      joiningChurchs:
        json.joiningChurchs == null ||
        json.joiningChurchs.toString().length === 0
          ? undefined
          : json.joiningChurchs.toString().split(","),
      churchOwner: json.churchOwner ?? undefined,
      updateAt: new Date().getMilliseconds(),
      createAt: new Date().getMilliseconds(),
      isActive: true,
    });
    memberModel.save();
    return memberModel;
  }

  async getAllMembers(): Promise<Array<LoginModelType>> {
    try {
      return LoginModel.find()
        .populate({
          path: "profile",
          options: { strict: false },
          populate: [
            { path: "title" },
            { path: "position" },
            { path: "joiningChurchs" },
            { path: "churchOwner" },
            { path: "department" },
          ],
        })
        .exec();
    } catch {
      console.log(error);
      return [];
    }
  }

  async getMemberDetail(accounntId: String): Promise<Array<LoginModelType>> {
    try {
      return LoginModel.find({ _id: accounntId })
        .populate({
          path: "profile",
          options: { strict: false },
          populate: [
            { path: "title" },
            { path: "position" },
            { path: "joiningChurchs" },
            { path: "churchOwner" },
            { path: "department" },
            { path: "familyMembers" },
          ],
        })
        .exec();
    } catch {
      console.log(error);
      return [];
    }
  }

  async deleteMember(query: Object): Promise<LoginModelType | null> {
    return LoginModel.findOneAndUpdate(query, { isActive: false });
  }

  async updateMember(account: any) {
    await LoginModel.updateOne({ _id: account.id }, account);
  }
}
