import mongoose from 'mongoose';
import express from 'express'
import https from 'https'
import fs from 'fs'
import AuthenticatorService from '../services/authenticator_service.js'

const options = {
    key: fs.readFileSync('../resources/config_files/key.pem'),
    cert: fs.readFileSync('../resources/config_files/cert.pem')
}
var app = express()
app.use(express.json()) 
const db = mongoose.connection;
mongoose.connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true,
})

app.listen(12345, () => {console.log('server is runing at port 4000')})
// https.createServer(options, app).listen(12345, () => {console.log('server is runing at port 4000')})


app.get('/', (request, response) => {
    response.send('Hello NodeJS')
})

app.post('/deleteAllDB', (request, response) => {
    mongoose.deleteModel('LoginModel')
    mongoose.deleteModel('MemberModel')
    response.send('OK')
})

app.post('/signup', async (request, response) => {
    let body = request.body
    let service = new AuthenticatorService()
    service.signup(body.username, body.password).then((result) => {
        response.send(result)
    })
})

app.post('/login', async (request, response) => {
    let body = request.body
    let service = new AuthenticatorService()
    service.login(body.username, body.password).then((result) => {
        response.send(result)
    })
})


