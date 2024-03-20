import { ACCESS_TOKEN_SECRET } from "../constants/app_config_contants.ts";
import LoginModel from "../models/login_model.ts";
import jwtHelper from "./jwt_helper.ts";

export let isAuth = async (req: any, res: any, next: any) => {
  const tokenFromClient =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    try {
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        ACCESS_TOKEN_SECRET
      );
      req.jwtDecoded = decoded;
      next();
    } catch (error: any) {
      return res.status(401).json({
        message:
          error.message == "jwt expired" ? "Token Expired" : "Unauthorized",
      });
    }
  } else {
    return res.status(403).send({ message: "No token provided." });
  }
};

export let isAdminRole = async (req: any, res: any, next: any) => {
  const tokenFromClient =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    try {
      const decoded: any = await jwtHelper.verifyToken(
        tokenFromClient,
        ACCESS_TOKEN_SECRET
      );
      req.jwtDecoded = decoded;
      const userData = decoded.data;
      const loginModel = await LoginModel.findOne({
        username: userData.name,
      }).exec();
      if (loginModel?.roles.includes("admin")) {
        next();
      } else {
        return res.status(406).json({
          message: "Only Admin can do this request",
        });
      }
    } catch (error: any) {
      return res.status(401).json({
        message:
          error.message == "jwt expired" ? "Token Expired" : "Unauthorized",
      });
    }
  } else {
    return res.status(403).send({ message: "No token provided." });
  }
};
