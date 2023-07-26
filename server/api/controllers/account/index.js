import * as service from '../../../db/service/UserService.js'
import * as serviceDal from '../../../db/dal/user.js'
import * as mapper from './mapper.js'
import { generateRefreshToken, getByRefreshToken } from '../../../db/service/AuthService.js'


export const getUserByMail = async (email) => {
  return mapper.toUser((await serviceDal.getUser(email)))
}

export const getUserByMailHomePage = async (email) => {
  return mapper.toNewUser((await serviceDal.getUser(email)))
}

export const deleteByEmail = async (email) => {
  const isDeleted = await service.deleteByEmail(email)
  return isDeleted
}

export const register = async (departmentId, payload, reqOrigin) => {
  const user = mapper.toUser(await service.signup(departmentId, payload))
  return user
}


export const getUsers = async (req, res) => {
  const users = await serviceDal.getAllUsers()
  return res.send(users)
}

export const CreateUserObject = async (user, Cookies) => {
  const departments = await service.getDepartments(user.id)
  const roles = await service.getRoles(user.id)
  const responseObject = {
    displayName: user.displayName,
   // token: Cookies["jwt"] != null ? Cookies["jwt"] : await service.CreateToken(user, roles),
   token: await service.CreateToken(user, roles),
    userName: user.userName,
    email: user.email,
    lastDepartmentVisited: departments.some(e => e.id === user.lastDepartmentVisited) ? user.lastDepartmentVisited : departments[0].id,
    departments,
    roles
  }
  return responseObject
}

export const setRole = async (email, role) => {
  const isSetRole = await service.setRole(email, role)
  return isSetRole
}

export const getUserFromHomePage = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log('token is not found');
    return res.sendStatus(401)
  }
  const userInfo = await service.verifyToken(token)
  if (!userInfo) return res.sendStatus(401)
  const user = await getUserByMailHomePage(userInfo.email)
  if (!user) return res.sendStatus(401)
  user.token = await service.CreateToken(user, user.roles)
  const refreshToken = await generateRefreshToken()
  await service.setRefreshToken(user, refreshToken.hash)
  res.cookie("refreshToken", refreshToken.hash, {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  return res.send(user)
}

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"]
  if (!refreshToken) {
    console.log('refreshToken is not found');
    return res.sendStatus(401)
  }
  const refreshTokenObject = await getByRefreshToken(refreshToken)
  if (!refreshTokenObject) {
    console.log('refreshTokenObject is not found');
    return res.sendStatus(401)
  }
  if (refreshTokenObject.expires < new Date()) {
    console.log('token is not expires');
    return res.sendStatus(401)
  }
  const user = mapper.toNewUser((await service.getUser(refreshTokenObject.userId)))
  const newToken = await service.CreateToken(user, user.roles)
  user.token = newToken
  res.cookie("jwt", newToken, {
    httpOnly: process.env.NODE_ENV === "production"
  })
  return res.send(user)
}

export const getUserDepartments = async (req, res) => {
  const mail = req.params.email
  const user = await serviceDal.getUser(mail)
  const departments = await service.getDepartments(user.id)
  return res.send(departments)
}

export const GetCurrentUserDepartments = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log('token is not found');
    return res.sendStatus(401)
  }
  const userInfo = await service.verifyToken(token)
  const departments = await service.getDepartments(userInfo.nameid)
  return res.send(departments)
}

export const logout = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token)  if (!token) {
    console.log('token is not found');
    return res.sendStatus(200)
  }
  res.cookie("jwt", token, {
    httpOnly: process.env.NODE_ENV === "production",
   secure: process.env.NODE_ENV === "production",
    maxAge: 0
  })
  return res.sendStatus(200)
}


export const updateLastDepartment = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log('token is not found');
    return res.sendStatus(401)
  }
  const userInfo = await service.verifyToken(token)
  const response = await service.updateLastDepartment(userInfo.nameid, req.params.departmentId)
  return res.json(req.params.departmentId.toString())
}

export const updatePhoneNumber = async (req, res) => {
  const { email, phone } = req.query
  const isUpdate = service.updatePhoneNumber(email, phone)
  res.send(isUpdate)
}