import { error } from "console";
import MemberModel, { MemberModelType } from "../models/member_model";

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

  async getMembers(query?: Object): Promise<Array<MemberModelType>> {
    try {
      if (query != null) {
        return MemberModel.find(query).exec();
      }
      return MemberModel.find().exec();
    } catch {
      console.log(error);
      return [];
    }
  }

  async getMemberDetail(memberId: String): Promise<Array<MemberModelType>> {
    try {
      return MemberModel.find({ _id: memberId })
        .populate("title position department joiningChurchs churchOwner")
        .populate([{ path: "familyMembers", populate: [{ path: "member" }] }])
        .exec();
    } catch {
      console.log(error);
      return [];
    }
  }

  async deleteMember(query: Object): Promise<MemberModelType | null> {
    return await MemberModel.findOneAndUpdate(query, { isActive: false });
  }

  async updateMember(member: any) {
    await MemberModel.updateOne({ _id: member.id }, member);
  }
}
