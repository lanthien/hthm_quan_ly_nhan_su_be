import LoginModel, { LoginModelType } from '../models/login_model.ts'
import { isNull, isUndefined } from '../constants/utils.ts'
import MemberModel from '../models/member_model.ts'

export default class AuthenticatorService {
    constructor() {}

    async getUserByUserName(username: String) : Promise<LoginModelType | null | undefined>  {
        try {
            return await LoginModel.findOne({ username : username })
            .select('-password')
            .populate('profile')
            .exec()
        }
        catch (error) {
            return undefined
        }
    }

    async verifyPassword(inputPassword: String, user: LoginModelType) {
        let password = user['password']
        return Promise.resolve(password == inputPassword) 
    }

    async login(username: String, password: String) {
        let model = await this.getUserByUserName(username)
        if ((isNull(model) || isUndefined(model))) {
            return {
                status: 'FAILED',
                message: 'Username is not existed'
            }
        }
        if (!(await this.verifyPassword(password, model!))) {
            return {
                status: 'FAILED',
                message: 'Wrong password'
            }
        }
        return model
    }

    async signup(username: String, password: String) {
        let member = await this.getUserByUserName(username)
        if (member) {
            return {
                status: 'FAILED',
                message: 'This username is already used'
            }
        }
        
        try {
            let memberModel = new MemberModel();
            await memberModel.save()
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