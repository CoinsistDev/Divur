import * as userDal from '../dal/user.js'
import * as DepartmentDal from '../dal/Deparment.js'
import { sendEmail } from '../../utils/email/sendEmail.js'
import * as authService from './AuthService.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.NODE_ENV === "production" ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

export const signup = async (departmentId, payload) => {
    const user = await userDal.create(departmentId, payload)
    const token = jwt.sign({ id: user.id }, JWTSecret);
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
    await authService.create({ userId: user.id, token: hash })
    const link = `${clientURL}account/resetPassword?token=${resetToken}&email=${user.email}`;
    sendEmail(user.email, "Password Reset Request", { name: user.displayName, link: link }, "./welcome.handlebars");
    return {
        userId: user.id,
        email: user.email,
        name: user.displayName,
        token: token
    }
}

export const verifyToken = async (token) => {
    try {
        const data = jwt.verify(token, JWTSecret);
        return data
    } catch (error) {
        console.log(error);
        return null
    }

}

export const getUserByUsername = async (username) => {
    const user = await userDal.getUserByUsername(username);
    return user
}

export const deleteByEmail = async (email) => {
    const user = await userDal.getUser(email);
    return userDal.deleteById(user.id)
}

export const requestPasswordReset = async (email) => {
    const user = await userDal.getUser(email);
    if (!user) throw new Error("Email does not exist");
    const token = await authService.getByUserId(user.id)
    if (token) await authService.deleteToken(token.userId);
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
    await authService.create({ userId: user.id, token: hash })
    const link = `${clientURL}account/resetPassword?token=${resetToken}&email=${user.email}`;
    sendEmail(user.email, "Password Reset Request", { name: user.displayName, link: link }, "./requestResetPassword.handlebars");
    return link;
};

export const resetPassword = async (email, token, password) => {
    const { id: userId } = await userDal.getUser(email)
    const passwordResetToken = await authService.getByUserId(userId)
    if (!passwordResetToken) throw new Error("Invalid or expired password reset token");
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) throw new Error("Invalid or expired password reset token");
    console.log(password);
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    console.log(hash);
    await userDal.updateOne({ id: userId, passwordHash: hash })
    const user = await userDal.getUserById(userId);
    sendEmail(user.email, "Password Reset Successfully", { name: user.displayName }, "./resetPassword.handlebars");
    await authService.deleteToken(passwordResetToken.userId);
    return true;
};



export const getRoles = async (userId) => {
    const roles = await userDal.getRoles(userId)
    const rolesArray = roles.roles.map((role) => role.name)
    return rolesArray
}

export const getDepartments = async (userId) => {
    const departments = await userDal.getDepartments(userId)
    const departmentArray = departments.departments.map(department => { return { name: department.name, id: department.id } });
    return departmentArray
}

export const setRole = async (email, role) => {
    const user = await userDal.getUser(email);
    const roleNum = await userDal.getRoleNum(role);
    return await userDal.createUserRole(user.id, roleNum)
}

export const CreateToken = async (user, roles) => {
    const claims = {
        email: user.email,
        unique_name: user.userName,
        nameid: user.id,
        role: roles.includes('Admin') ? 'Admin' : roles.includes('Implementor') ? 'Implementor' : 'User'
    }
    const token = jwt.sign(claims, JWTSecret, { algorithm: 'HS512', expiresIn: '1d' });
    return token
}

export const setRefreshToken = async(user, refreshToken) => {
    const userToken = await authService.createOrUpdateNew(user, refreshToken)
    return userToken
}

export const getUser = async(userId) => {
    const user = await userDal.getUserByIdAll(userId)
    return user
}

export const updateLastDepartment = async(userId, departmentId) => {
    const department = await DepartmentDal.getById(departmentId)
    const updatUser = await userDal.editUser(userId, departmentId)
    return updatUser
}

export const updatePhoneNumber = async(email, phone) => {
    const user = await userDal.getUser(email);
    const updatUser = await userDal.updatePhoneNumber(user.id, phone)
    return updatUser
}
