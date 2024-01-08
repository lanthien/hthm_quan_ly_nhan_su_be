import express from 'express'
import fs from 'fs'
import AuthenticatorService from '../services/authenticator_service.ts'
import DatabaseService from '../services/database_service.ts'
import LoginModel from '../models/login_model.ts'
import MemberModel from '../models/member_model.ts'
import TitleModel from '../models/title_model.ts'
import PositionModel from '../models/position_model.ts'
import DepartmentModel from '../models/department_model.ts'
import MemberDAO from '../dao/member_dao.ts'
import TitleDAO from '../dao/title_dao.ts'
import ChurchDAO from '../dao/church_dao.ts'
import DepartmentDAO from '../dao/department_dao.ts'
import PositionDAO from '../dao/position_dao.ts'
import { upload } from '../services/multer_service.ts'
import { error } from 'console'

const options = {
    key: fs.readFileSync('../resources/config_files/key.pem'),
    cert: fs.readFileSync('../resources/config_files/cert.pem')
}
const databaseService = new DatabaseService()
const memberDAO = new MemberDAO()
const titleDAO = new TitleDAO()
const churchDAO = new ChurchDAO()
const departmentDAO = new DepartmentDAO()
const positionDAO = new PositionDAO()

var app = express()
app.use(express.json()) 
app.use(express.urlencoded({extended: true}))
databaseService.initialDatabase()
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.listen(12345, () => {console.log('server is runing at port 4000')})


app.get('/', (request, response) => {
    response.send('Hello NodeJS')
})

app.post('/deleteAllDB', async (request, response) => {
    await LoginModel.deleteMany({})
    await MemberModel.deleteMany({})
    await TitleModel.deleteMany({})
    await PositionModel.deleteMany({})
    await DepartmentModel.deleteMany({})
    response.send('OK')
})

app.post('/signup', async (request, response) => {
    let body = request.body
    let service = new AuthenticatorService()
    service.signup(body.username, body.password).then((result: any) => {
        response.send(result)
    })
})

app.post('/login', async (request, response) => {
    let body = request.body
    let service = new AuthenticatorService()
    service.login(body.username, body.password).then((result: any) => {
        response.send(result)
    })
})

//Member
app.post('/addNewMember', (request, response) => {
    let body = request.body
    let responseModel = memberDAO.addNewMember(body)
    response.send(JSON.stringify(responseModel))
})

app.get('/getAllMembers', async (request, response) => {
    let members = await memberDAO.getMembers()
    response.send(JSON.stringify(members))
})

app.delete('/deleteMember', async (request, response) => {
    try {
        let member = await memberDAO.deleteMember({ _id : request.body.userId})
        response.send(JSON.stringify(member))
    } catch {
        response.send(error);
    }
})

app.delete('/updateMember', async (request, response) => {
    try {
        let member = await memberDAO.updateMember(request.body)
        response.send("Ok")
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})


// Titles
app.get('/getAllTitles', async (resquest, response) => {
    try {
        let titles = await titleDAO.getAllTitle()
        response.send(JSON.stringify(titles))
    } catch {
        response.send(error);
    }
})

app.post('/createTitle', async (request, response) => {
    try {
        let departments = await titleDAO.addTitle(request.body['name']);
        response.send(JSON.stringify(departments))
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})

app.post('/title', async (request, response) => {
    try {
        const titleId = request.query.id as String;
        let departments = await titleDAO.updateTitle(titleId, request.body);
        response.send(JSON.stringify(departments))
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})

/// Church
app.get('/getAllChurchs', async (resquest, response) => {
    try {
        let churchs = await churchDAO.getAllChurchs()
        response.send(JSON.stringify(churchs))
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})

app.post('/addNewChurch', async (request, response) => {
    try {
        let churchs = await churchDAO.addChurch(request.body['name'], request.body['address'] )
        response.send(JSON.stringify(churchs))
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})

/// Department
app.get('/getAllDepartments', async (request, response) => {
    try {
        let departments = await departmentDAO.getAllDepartments()
        response.send(JSON.stringify(departments))
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})

app.post('/createDepartment', async (request, response) => {
    try {
        let departments = await departmentDAO.addDepartment(request.body['name']);
        response.send(JSON.stringify(departments))
    } catch (error: any){
        response.send({error: error.name, message : error.message});
    }
})

app.post('/department', async (request, response) => {
    try {
        const departmentId = request.query.id as String;
        let departments = await departmentDAO.updateDepartment(departmentId, request.body);
        response.send(JSON.stringify(departments))
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})

/// Position
app.get('/getAllPositions', async (resquest, response) => {
    try {
        let positions = await positionDAO.getAllPositions()
        response.send(JSON.stringify(positions))
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})

app.post('/createPosition', async (request, response) => {
    try {
        let positionModel = await positionDAO.addPosition(request.body['name']);
        response.send(JSON.stringify(positionModel))
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})

app.post('/position', async (request, response) => {
    try {
        const positionId = request.query.id as String;
        let position = await positionDAO.updatePosition(positionId, request.body);
        response.send(JSON.stringify(position))
    } catch (error: any) {
        response.send({error: error.name, message : error.message});
    }
})

app.post('/uploadAvatar', upload.single('myfile'), (request, response, next) => {
    const file = request.file
    if (!file) {
      var error = new Error('Please upload a file')
      response.status(400)
      return next(error)
    }
    response.send(file)
})