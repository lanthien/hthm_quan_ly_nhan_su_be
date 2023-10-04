import LoginModel from '../models/login_model.js'
import { isNull, isUndefined } from '../constants/utils.js'
import MemberModel from '../models/member_model.js'

class AuthenticatorService {
    constructor() {}

    async getUserByUserName(username) {
        try {
            return await LoginModel.findOne({ username : username }).populate('profile').exec()
        }
        catch (error) {
            return undefined
        }
    }

    async verifyPassword(inputPassword, user) {
        let password = user['password']
        return Promise.resolve(password == inputPassword) 
    }

    async login(username, password) {
        let model = await this.getUserByUserName(username)
        if ((isNull(model) || isUndefined(model))) {
            return {
                status: 'FAILED',
                message: 'Username is not existed'
            }
        }
        if (!(await this.verifyPassword(password, model))) {
            return {
                status: 'FAILED',
                message: 'Wrong password'
            }
        }
        return model
    }

    async signup(username, password) {
        let member = await this.getUserByUserName(username)
        if (member) {
            return {
                status: 'FAILED',
                message: 'This username is already used'
            }
        }
        
        try {
            let memberModel = new MemberModel();
            memberModel.save()
            let loginModel = new LoginModel({
                username: username,
                password: password,
                profile: memberModel._id
            })
            return await loginModel.save()
        } catch (error) {
            console.log('Error ' + error)
            return {
                status: 'FAILED',
                message: 'Signup fail'
            }
        }
        
    }
}

export default AuthenticatorService