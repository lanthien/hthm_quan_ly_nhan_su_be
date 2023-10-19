import mongoose from 'mongoose'
import express, { query, response } from 'express'
import fs from 'fs'

import AuthenticatorService from '../services/authenticator_service.ts'
import DatabaseService from '../services/database_service.ts'
import LoginModel, {LoginModelType} from '../models/login_model.ts'
import MemberModel, {MemberModelType} from '../models/member_model.ts'
import { error } from 'console'

const options = {
    key: fs.readFileSync('../resources/config_files/key.pem'),
    cert: fs.readFileSync('../resources/config_files/cert.pem')
}
const databaseService = new DatabaseService()

var app = express()
app.use(express.json()) 
app.use(express.urlencoded({extended: true}))
databaseService.initialDatabase()

app.listen(12345, () => {console.log('server is runing at port 4000')})


app.get('/', (request, response) => {
    response.send('Hello NodeJS')
})

app.post('/deleteAllDB', async (request, response) => {
    await LoginModel.deleteMany({})
    await MemberModel.deleteMany({})
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

app.post('/addNewMember', (request, response) => {
    let body = request.body
    let responseModel = databaseService.addNewMember(body)
    response.send(JSON.stringify(responseModel))
})

app.get('/getAllMembers', async (request, response) => {
    let members = await databaseService.getMembers()
    response.send(JSON.stringify(members))
})

app.delete('/deleteMemember', async (request, response) => {
    try {
        let member = await databaseService.deleteMember({ _id : request.body.id})
        response.send(JSON.stringify(member))
    } catch {
        response.send(error);
    }
})


