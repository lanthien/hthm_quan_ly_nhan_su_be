import { error } from "console";
import fs from "fs";
import MemberModel, { MemberModelType } from "../models/member_model";
import LoginModel, { LoginModelType } from "../models/login_model";
import PositionModel, { PositionModelType } from "../models/position_model";
import { pipeline } from "stream";
import ChurchPositionModel from "../models/church_position_model";

export default class MemberDAO {
  async addNewMember(json: any): Promise<LoginModelType> {
    let profileJson = json["profile"];
    let memberModel = new MemberModel({
      name: profileJson.name,
      phoneNumber: profileJson.phoneNumber,
      personalId: profileJson.personalId,
      title: profileJson.title,
      genre: profileJson.genre,
      national: profileJson.national,
      birthday: profileJson.birthday,
      tempAddress: profileJson.tempAddress,
      permanentAddress: profileJson.permanentAddress,
      churchPositions: profileJson.churchPositions,
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
        {
          path: "churchPositions",
          populate: [{ path: "position" }, { path: "church" }],
        },
      ],
    });
  }

  async searchMembers(query: String): Promise<Array<LoginModelType>> {
    let pipeline = await this._buildSearchMemberWith(query);
    return LoginModel.aggregate(pipeline).exec();
  }

  async getAllMembers(): Promise<Array<LoginModelType>> {
    try {
      return LoginModel.find()
        .select("-password -accessToken -refreshToken")
        .populate({
          path: "profile",
          select: "-familyMembers",
          populate: [
            { path: "title" },
            {
              path: "churchPositions",
              select: "-church",
              populate: [{ path: "position" }],
            },
          ],
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
          {
            path: "churchPositions",
            populate: [{ path: "position" }, { path: "church" }],
          },
          {
            path: "familyMembers",
            populate: {
              path: "member",
              select: "-password -accessToken -refreshToken",
              populate: [
                {
                  path: "profile",
                  select: "-familyMembers -title",
                  populate: [
                    {
                      path: "churchPositions",
                      select: "-church",
                      populate: [{ path: "position" }],
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
  }

  async deleteMember(query: Object): Promise<LoginModelType | null> {
    let loginModel = await LoginModel.findOne(query).select(
      "-password -accessToken -refreshToken"
    );
    if (loginModel?.roles.indexOf("admin") != -1) {
      throw new Error("Không thể xóa tài khoản này.");
      return null;
    }
    loginModel?.deleteOne(query);
    if (loginModel?.profile != undefined) {
      let profileId = loginModel?.profile!.toString();
      let profile = await MemberModel.findOneAndDelete({
        _id: loginModel?.profile!.toString(),
      }).exec();
      this._removeOldAvatar(profile?.avatarImage ?? "");
    }
    return loginModel;
  }

  async updateMember(json: any): Promise<LoginModelType> {
    let memberJson = json["profile"];
    let memberId = memberJson.id;

    let x = await MemberModel.updateOne({ _id: memberJson.id }, memberJson);

    let profileJson = {
      username: json["username"],
      password: json["password"],
      isActive: json["isActive"],
      roles: json["roles"],
    };
    await LoginModel.updateOne({ _id: json["id"] }, profileJson).populate({
      path: "profile",
      populate: [
        { path: "title" },
        {
          path: "churchPositions",
          populate: [{ path: "position" }, { path: "church" }],
        },
      ],
    });

    let loginModel = new LoginModel({
      username: json["username"],
      isActive: json["isActive"],
      roles: json["roles"],
      profile: memberId,
    }).populate({
      path: "profile",
      populate: [
        { path: "title" },
        {
          path: "churchPositions",
          populate: [{ path: "position" }, { path: "church" }],
        },
        {
          path: "familyMembers",
          populate: {
            path: "member",
            populate: [
              {
                path: "profile",
                select: "-familyMembers -title",
              },
              {
                path: "churchPositions",
                select: "-church",
                populate: [{ path: "position" }],
              },
            ],
          },
        },
      ],
    });

    let newProfile = await MemberModel.findOne({ _id: memberJson.id });
    let removedChurchPosition = newProfile?.churchPositions.filter(
      (item) =>
        (memberJson["churchPositions"] as Array<String>).indexOf(
          item.toString()
        ) == -1
    );
    removedChurchPosition?.forEach(async (element) => {
      await ChurchPositionModel.deleteMany(element);
    });

    return loginModel;
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
        .status(201)
        .json({ errorCode: 201, messsage: "Cannot find the account" });
      return;
    }
    let memberModel = await MemberModel.findOne({ _id: loginModel.profile });
    this._removeOldAvatar(memberModel?.avatarImage ?? "");

    await memberModel?.updateOne({ avatarImage: imagePath });
  }

  async _buildSearchMemberWith(query: String): Promise<Array<any>> {
    let positions = await PositionModel.find({}).exec();

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
      // Title
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
      // churchpositionmodels
      {
        $lookup: {
          from: "churchpositionmodels",
          localField: "profile.churchPositions",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "positionmodels",
                localField: "position",
                foreignField: "_id",
                as: "position",
              },
            },
            {
              $unwind: {
                path: "$position",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "churchmodels",
                localField: "church",
                foreignField: "_id",
                as: "church",
              },
            },
            {
              $unwind: {
                path: "$church",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "profile.churchPositions",
        },
      },
      // Search
      {
        $match: {
          $or: [
            { "profile.name": { $regex: query } },
            {
              "profile.churchPositions": {
                $elemMatch: { "position.name": { $regex: query } },
              },
            },
            {
              "profile.churchPositions": {
                $elemMatch: { "church.name": { $regex: query } },
              },
            },
            { "profile.title.name": { $regex: query } },
          ],
        },
      },

      // Remove data in json
      { $unset: "password" },
      { $unset: "refreshToken" },
      { $unset: "accessToken" },
      { $unset: "profile.churchPositions" },
      { $unset: "profile.familyMembers" },
    ];
  }

  private async _removeOldAvatar(imagePath: string) {
    if (imagePath.length == 0) {
      return;
    }
    let fullPath = "../resources/public" + imagePath;
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath);
    }
  }
}
