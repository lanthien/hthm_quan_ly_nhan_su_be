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
    let newUser = await loginModel.save();

    return new LoginModel({
      _id: newUser._id,
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

  async searchMembers(query: String): Promise<Array<LoginModelType>> {
    let pipeline = this._buildSearchMemberWith(query);
    return LoginModel.aggregate(pipeline).exec();
  }

  async getAllMembers(): Promise<Array<LoginModelType>> {
    try {
      return LoginModel.find()
        .select("-password -accessToken -refreshToken")
        .populate({
          path: "profile",
          select:
            "-familyMembers -position -department -joiningChurchs -churchOwner -title",
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
              select: "-password -accessToken -refreshToken",
              populate: [
                {
                  path: "profile",
                  select:
                    "-familyMembers -position -department -joiningChurchs -churchOwner -title",
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

  async updateMember(json: any): Promise<LoginModelType> {
    let memberJson = json["profile"];
    let memberId = memberJson.id;
    await MemberModel.updateOne({ _id: memberJson.id }, memberJson);

    let profileJson = {
      username: json["username"],
      password: json["password"],
      isActive: json["isActive"],
      roles: json["roles"],
    };
    await LoginModel.updateOne({ _id: json["id"] }, profileJson).populate({
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

    return new LoginModel({
      username: json["username"],
      isActive: json["isActive"],
      roles: json["roles"],
      profile: memberId,
    }).populate({
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
                select:
                  "-familyMembers -position -department -joiningChurchs -churchOwner -title",
              },
            ],
          },
        },
      ],
    });
  }

  async uploadAvatar(imagePath: String, req: any, res: any) {
    let accountId = req.body.id;
    if (accountId == null) {
      res.status(200).json({ errorCode: 201, messsage: "Missing id field" });
      return;
    }
    let loginModel: LoginModelType | null = await LoginModel.findOne({
      _id: accountId,
    });
    if (loginModel == null) {
      res
        .status(200)
        .json({ errorCode: 201, messsage: "Cannot find the account" });
      return;
    }
    await MemberModel.updateOne(
      { _id: loginModel.profile },
      { avatarImage: imagePath }
    );
  }

  private _buildSearchMemberWith(query: String): Array<any> {
    return [
      // Link LoginModel to MemberModel
      {
        $lookup: {
          from: "membermodels",
          localField: "profile",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $unwind: "$profile",
      },
      // Link MemberModel to DeparmentModel
      {
        $lookup: {
          from: "departmentmodels",
          localField: "profile.department",
          foreignField: "_id",
          as: "profile.department",
        },
      },
      {
        $unwind: {
          path: "$profile.department",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Link MemberModel to PositionModel
      {
        $lookup: {
          from: "positionmodels",
          localField: "profile.position",
          foreignField: "_id",
          as: "profile.position",
        },
      },
      {
        $unwind: {
          path: "$profile.position",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Link MemberModel to TitleModel
      {
        $lookup: {
          from: "titlemodels",
          localField: "profile.title",
          foreignField: "_id",
          as: "profile.title",
        },
      },
      {
        $unwind: {
          path: "$profile.title",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Search
      {
        $match: {
          $or: [
            { "profile.name": { $regex: query } },
            { "profile.department.name": { $regex: query } },
            { "profile.position.name": { $regex: query } },
            { "profile.title.name": { $regex: query } },
          ],
        },
      },
      // Remove data in json
      { $unset: "password" },
      { $unset: "refreshToken" },
      { $unset: "accessToken" },
      { $unset: "profile.joiningChurchs" },
      { $unset: "profile.churchOwner" },
      { $unset: "profile.familyMembers" },
    ];
  }
}
