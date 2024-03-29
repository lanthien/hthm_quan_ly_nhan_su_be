import { error } from "console";
import MemberModel, { MemberModelType } from "../models/member_model";
import LoginModel, { LoginModelType } from "../models/login_model";

export default class MemberDAO {
  async addNewMember(json: any): Promise<LoginModelType> {
    let profileJson = json["profile"];
    let memberModel = new MemberModel({
      name: profileJson.name,
      phoneNumber: profileJson.phoneNumber,
      personalId: profileJson.personalId,
      title: profileJson.title,
      position: profileJson.position,
      department: profileJson.department,
      genre: profileJson.genre,
      national: profileJson.national,
      birthday: profileJson.birthday,
      tempAddress: profileJson.tempAddress,
      permanentAddress: profileJson.permanentAddress,
      joiningChurchs:
        profileJson.joiningChurchs == null ||
        profileJson.joiningChurchs.toString().length === 0
          ? undefined
          : profileJson.joiningChurchs.toString().split(","),
      churchOwner: profileJson.churchOwner ?? undefined,
      updateAt: new Date().getMilliseconds(),
      createAt: new Date().getMilliseconds(),
      isActive: true,
    });
    await memberModel.save();
    let loginModel = new LoginModel({
      username: json.username,
      password: json.password,
      profile: memberModel._id,
    });
    await loginModel.save();

    return new LoginModel({
      username: json.username,
      roles: loginModel.roles,
      profile: memberModel._id,
    }).populate({
      path: "profile",
      options: { strict: false },
      populate: [
        { path: "title" },
        { path: "position" },
        { path: "joiningChurchs" },
        { path: "churchOwner" },
        { path: "department" },
      ],
    });
  }

  async getAllMembers(): Promise<Array<LoginModelType>> {
    try {
      return LoginModel.find()
        .select("-password -accessToken -refreshToken")
        .populate({
          path: "profile",
          select: "-familyMembers",
        })
        .exec();
    } catch {
      console.log(error);
      return [];
    }
  }

  async getMemberDetail(accounntId: String): Promise<LoginModelType | null> {
    return LoginModel.findOne({ _id: accounntId })
      .select("-password -accessToken -refreshToken")
      .populate({
        path: "profile",
        populate: [
          { path: "title" },
          { path: "position" },
          { path: "joiningChurchs" },
          { path: "churchOwner" },
          { path: "department" },
          {
            path: "familyMembers",
            populate: {
              path: "member",
              populate: [
                {
                  path: "profile",
                  select: "name personalId phoneNumber",
                },
              ],
            },
          },
        ],
      });
  }

  async deleteMember(query: Object): Promise<LoginModelType | null> {
    return await LoginModel.findOneAndUpdate(query, { isActive: false })
      .select("-password")
      .exec();
  }

  async updateMember(memberInfo: any) {
    await MemberModel.updateOne({ _id: memberInfo.id }, memberInfo)
      .select("-password")
      .exec();
  }
}
