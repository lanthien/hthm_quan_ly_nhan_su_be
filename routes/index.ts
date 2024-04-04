import express from "express";
import fs from "fs";
import AuthenticatorService from "../services/authenticator_service.ts";
import DatabaseService from "../services/database_service.ts";
import LoginModel from "../models/login_model.ts";
import MemberModel from "../models/member_model.ts";
import TitleModel from "../models/title_model.ts";
import PositionModel from "../models/position_model.ts";
import DepartmentModel from "../models/department_model.ts";
import TitleDAO from "../dao/title_dao.ts";
import ChurchDAO from "../dao/church_dao.ts";
import DepartmentDAO from "../dao/department_dao.ts";
import PositionDAO from "../dao/position_dao.ts";
import { upload } from "../services/multer_service.ts";
import { error } from "console";
import { isAdminRole, isAuth } from "../services/auth_middleware.ts";
import ChurchModel from "../models/church_model.ts";
import MemberDAO from "../dao/member_dao.ts";

const options = {
  key: fs.readFileSync("../resources/config_files/key.pem"),
  cert: fs.readFileSync("../resources/config_files/cert.pem"),
};
const databaseService = new DatabaseService();
const memberDAO = new MemberDAO();
const titleDAO = new TitleDAO();
const churchDAO = new ChurchDAO();
const departmentDAO = new DepartmentDAO();
const positionDAO = new PositionDAO();

let router = express.Router();
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
databaseService.initialDatabase();
app.use(express.static("../resources/public"));

app.listen(12345, () => {
  console.log("server is runing at port 4000");
});

let service = new AuthenticatorService();

app.get("/", (request, response) => {
  response.send("Hello NodeJS");
});

app.post("/deleteAllDB", async (request, response) => {
  await LoginModel.deleteMany({});
  //127.0.0.1:12345/resources/images
  http: await MemberModel.deleteMany({});
  await TitleModel.deleteMany({});
  await PositionModel.deleteMany({});
  await DepartmentModel.deleteMany({});
  await ChurchModel.deleteMany({});
  response.send("OK");
});

app.post("/signup", async (request, response) => {
  let body = request.body;
  service.signup(body.username, body.password).then((result: any) => {
    response.send(result);
  });
});

app.post("/login", async (request, response) =>
  service.login(request, response)
);

app.post("/refreshToken", async (request, response) =>
  service.refreshToken(request, response)
);

app.post("/signout", isAuth, async (request, response) =>
  service.signout(request, response)
);

//Member
app.post("/addNewMember", isAuth, isAdminRole, async (request, response) => {
  try {
    let body = request.body;
    let responseModel = await memberDAO.addNewMember(body);
    response.status(200).json(responseModel);
  } catch (error: any) {
    response.status(400).json({ error: error.name, message: error.message });
  }
});

app.get("/getAllMembers", isAuth, async (request, response) => {
  try {
    let members = await memberDAO.getAllMembers();
    response.status(200).json(members);
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.get("/getMember/:id", isAuth, async (request, response) => {
  try {
    let id = request.params.id;
    let member = await memberDAO.getMemberDetail(id);
    response.status(200).json(member);
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.delete("/deleteMember", isAuth, isAdminRole, async (request, response) => {
  try {
    let member = await memberDAO.deleteMember({ _id: request.body.userId });
    response.send(JSON.stringify(member));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.delete("/updateMember", isAuth, async (request, response) => {
  try {
    let member = await memberDAO.updateMember(request.body);
    response.send("Ok");
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.get("/members/search", isAuth, async (request, response) => {
  try {
    let query = request.query.query as String;
    let members = await memberDAO.searchMembers(query);
    response.status(200).json(members);
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

// Titles
app.get("/getAllTitles", isAuth, async (resquest, response) => {
  try {
    let titles = await titleDAO.getAllTitle();
    response.send(JSON.stringify(titles));
  } catch {
    response.status(400).send(error);
  }
});

app.post("/createTitle", isAuth, async (request, response) => {
  try {
    let departments = await titleDAO.addTitle(request.body["name"]);
    response.send(JSON.stringify(departments));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.post("/title", isAuth, async (request, response) => {
  try {
    const titleId = request.query.id as String;
    let departments = await titleDAO.updateTitle(titleId, request.body);
    response.send(JSON.stringify(departments));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.get("/titles/search", isAuth, async (request, response) =>
  titleDAO.searchTitles(request, response)
);

/// Church
app.get("/churchs/getAll", isAuth, async (resquest, response) => {
  try {
    let churchs = await churchDAO.getAllChurchs();
    response.send(JSON.stringify(churchs));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.post("/churchs/addNew", isAuth, async (request, response) => {
  try {
    let churchs = await churchDAO.addChurch(
      request.body["name"],
      request.body["address"]
    );
    response.send(JSON.stringify(churchs));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.post("/churchs/update", isAuth, async (request, response) => {
  try {
    // req.params.id
    let churchs = await churchDAO.updateChurch(request.body["id"], {
      name: request.body["name"],
      address: request.body["address"],
      isActive: request.body["isActive"],
    });
    response.send(JSON.stringify(churchs));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.get("/churchs/search", isAuth, async (request, response) =>
  churchDAO.searchChurchs(request, response)
);

/// Department
app.get("/getAllDepartments", isAuth, async (request, response) => {
  try {
    let departments = await departmentDAO.getAllDepartments();
    response.send(JSON.stringify(departments));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.post("/createDepartment", isAuth, async (request, response) => {
  try {
    let departments = await departmentDAO.addDepartment(request.body["name"]);
    response.send(JSON.stringify(departments));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.post("/department", isAuth, async (request, response) => {
  try {
    const departmentId = request.query.id as String;
    let departments = await departmentDAO.updateDepartment(
      departmentId,
      request.body
    );
    response.send(JSON.stringify(departments));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.get("/departments/search", isAuth, async (request, response) =>
  departmentDAO.searchDepartments(request, response)
);

/// Position
app.get("/getAllPositions", isAuth, async (resquest, response) => {
  try {
    let positions = await positionDAO.getAllPositions();
    response.send(JSON.stringify(positions));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.post("/createPosition", isAuth, async (request, response) => {
  try {
    let positionModel = await positionDAO.addPosition(request.body["name"]);
    response.send(JSON.stringify(positionModel));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.post("/position", isAuth, async (request, response) => {
  try {
    const positionId = request.query.id as String;
    let position = await positionDAO.updatePosition(positionId, request.body);
    response.send(JSON.stringify(position));
  } catch (error: any) {
    response.status(400).send({ error: error.name, message: error.message });
  }
});

app.get("/positions/search", isAuth, async (request, response) =>
  positionDAO.searchPositions(request, response)
);

app.post(
  "/uploadAvatar",
  upload.single("avatar"),
  async (request, response, next) => {
    const file = request.file;
    if (!file) {
      var error = new Error("Đã xảy ra lỗi");
      response.status(400);
      return next(error);
    }
    try {
      const member = {
        id: request.body.id,
        avatarImage: `${request.protocol}://${request.headers.host}/avatarImages/${file.filename}`,
      };
      await memberDAO.updateMember(member);
      response.send(file);
    } catch (error: any) {
      response.status(400).send({ error: error.name, message: error.message });
    }
  }
);
