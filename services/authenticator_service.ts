import LoginModel, { LoginModelType } from "../models/login_model.ts";
import { isNull, isUndefined } from "../constants/utils.ts";
import MemberModel from "../models/member_model.ts";
import jwtHelper from "./jwt_helper.ts";
import * as AppConfig from "../constants/app_config_contants.ts";

export default class AuthenticatorService {
  constructor() {}

  async getUserByUserName(
    username: String
  ): Promise<LoginModelType | null | undefined> {
    try {
      return await LoginModel.findOne({ username: username })
        .select("-password")
        .exec();
    } catch (error) {
      return undefined;
    }
  }

  async verifyPassword(inputPassword: String, user: LoginModelType) {
    let password = user["password"];
    return Promise.resolve(password == inputPassword);
  }

  async login(req: any, res: any) {
    let { password, username } = req.body;
    let model = await LoginModel.findOne({ username: username }).exec();
    if (isNull(model) || isUndefined(model)) {
      return res.status(401).json({ message: "User is not exists" });
    }
    if (!(await this.verifyPassword(password, model!))) {
      return res.status(401).json({ message: "Wrong password" });
    }
    let userData = {
      name: model!.username,
      _id: model!._id,
      role: model!.roles,
    };
    const accessToken = await jwtHelper.generateToken(
      userData,
      AppConfig.ACCESS_TOKEN_SECRET,
      AppConfig.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await jwtHelper.generateToken(
      userData,
      AppConfig.REFRESH_TOKEN_SECRET,
      AppConfig.REFRESH_TOKEN_LIFE
    );
    await LoginModel.updateOne(
      { _id: model!._id },
      { accessToken: accessToken, refreshToken: refreshToken }
    );
    return res.status(200).json(
      await new LoginModel({
        _id: model?.id,
        username: model?.username,
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: model?.profile,
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
      })
    );
  }

  async signup(username: String, password: String) {
    let member = await this.getUserByUserName(username);
    if (member) {
      return {
        status: "FAILED",
        message: "This username is already used",
      };
    }
    try {
      let loginModel = new LoginModel({
        username: username,
        password: password,
        createAt: Date(),
      });
      await loginModel.save();
      return new LoginModel({
        username: username,
        createAt: Date(),
      });
    } catch (error) {
      console.log("Error " + error);
      return {
        status: "FAILED",
        message: "Signup fail",
      };
    }
  }

  async signout(request: any, response: any) {
    const tokenFromClient =
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"];
    if (tokenFromClient != null && tokenFromClient != undefined) {
      try {
        const decoded: any = await jwtHelper.verifyToken(
          tokenFromClient,
          AppConfig.ACCESS_TOKEN_SECRET
        );
        const userData = decoded.data;
        const loginModel = await LoginModel.findOne({
          username: userData.name,
        }).exec();
        if (isNull(loginModel) || isUndefined(loginModel)) {
          return response.status(401).json({ message: "User is not exists" });
        }
        await LoginModel.updateOne(
          { _id: loginModel!._id },
          { accessToken: null, refreshToken: null }
        );
        return response.status(200).json({ message: "Signout Successful" });
      } catch (error: any) {
        return response.status(401).json({ message: error.message });
      }
    } else {
      return response.status(401).json({ message: "Signout Unsuccessful" });
    }
  }

  async refreshToken(request: any, response: any) {
    const tokenFromClient = request.body.refreshToken;
    if (tokenFromClient != null && tokenFromClient != undefined) {
      try {
        const decoded: any = await jwtHelper.verifyToken(
          tokenFromClient,
          AppConfig.REFRESH_TOKEN_SECRET
        );
        const userData = decoded.data;
        const loginModel = await LoginModel.findOne({
          username: userData.name,
        }).exec();
        if (isNull(loginModel) || isUndefined(loginModel)) {
          return response.status(401).json({ message: "User is not exists" });
        }
        const accessToken = await jwtHelper.generateToken(
          userData,
          AppConfig.ACCESS_TOKEN_SECRET,
          AppConfig.ACCESS_TOKEN_LIFE
        );
        const refreshToken = await jwtHelper.generateToken(
          userData,
          AppConfig.REFRESH_TOKEN_SECRET,
          AppConfig.REFRESH_TOKEN_LIFE
        );
        await LoginModel.updateOne(
          { _id: loginModel!._id },
          { accessToken: accessToken, refreshToken: refreshToken }
        );
        return response.status(200).json(
          await new LoginModel({
            _id: loginModel?.id,
            username: loginModel?.username,
            accessToken: accessToken,
            refreshToken: refreshToken,
          })
        );
      } catch (error: any) {
        return response.status(401).json({ message: error.message });
      }
    } else {
      return response.status(401).json({ message: "Unauthorized" });
    }
  }
}
