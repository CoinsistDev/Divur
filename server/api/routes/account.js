import { query, Router } from 'express'
import asyncHandler from "express-async-handler"
import bcrypt from 'bcrypt'
import { deleteByEmail, CreateUserObject, setRole, getUserFromHomePage, getUserByMail, refreshToken, getUserDepartments, GetCurrentUserDepartments, updateLastDepartment, updatePhoneNumber, logout } from '../controllers/account/index.js'
import { signup, requestPasswordReset, resetPassword, verifyToken } from '../../db/service/UserService.js'
import * as authService from '../../db/service/AuthService.js'
import crypto from 'crypto'
import { sendOtp, VerifyOtp, cancelOtp } from '../controllers/voanage/OTPSender.js'
import { isAdmin, authorization, isAdminOrImplementor } from '../../middleware/authMiddleware.js'


const bcryptSalt = process.env.BCRYPT_SALT;

const accountRouter = Router()

//Delete User
accountRouter.delete('/:email',authorization, isAdmin, asyncHandler(async (req, res) => {
  const result = await deleteByEmail(req.params.email)
  res.send(result)
}))

// Register User
accountRouter.post('/register/:id', asyncHandler(async (req, res) => {
  const payload = req.body
  const result = await signup(req.params.id, payload)
  res.send(result)
}))


// Refresh Toekn
accountRouter.post('/refreshToken', asyncHandler(refreshToken))

// Home Page
accountRouter.get('/', asyncHandler(getUserFromHomePage))

// Get User Departments
accountRouter.get('/departments/:email', authorization, isAdminOrImplementor, asyncHandler(getUserDepartments))

// Get Current User Departments
accountRouter.get('/departments', asyncHandler(GetCurrentUserDepartments))

// Update Last Department
accountRouter.put('/updateLastDepartment/:departmentId', asyncHandler(updateLastDepartment))


// Update user phone
accountRouter.put('/phoneNumber', asyncHandler(updatePhoneNumber))

// Send Request Reset Password
accountRouter.get('/sendResetPasswordMail/:email', asyncHandler(async (req, res) => {
  console.log('sendResetPasswordMail');
  const result = await requestPasswordReset(req.params.email)
  res.send(result)
}))

// Reset Password
accountRouter.post('/resetPassword', asyncHandler(async (req, res) => {
  console.log('resetPassword');
  const { email, token, password } = req.body
  const result = await resetPassword(email, token, password)
  res.send(result)
}))

// Login
accountRouter.post('/login', asyncHandler(async (req, res) => {
  console.log('Login');
  const { email, password } = req.body
  if (!(email && password)) return res.sendStatus(401)
  const user = await getUserByMail(email)
  if (!user) 
    throw new Error('מייל לא קיים במערכת')
  if (!(user && bcrypt.compareSync(password, user.passwordHash)))
     throw new Error('מייל או סיסמה אינם נכונים')
    const userObject = await CreateUserObject(user, req.cookies)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
    await authService.createOrUpdate({ userId: user.id, token: hash })
    res.cookie("jwt", userObject.token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
    })
    res.cookie("refreshToken", resetToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
     res.status(200).json(userObject)
  }

))

// Login 2FA
accountRouter.post('/login2fa', asyncHandler(async (req, res) => {
  const { email, password } = req.body
  console.log('ogin2fa');
  if (!(email && password)) return res.sendStatus(401)
  const user = await getUserByMail(email)
  console.log(password);
  if (!(user && bcrypt.compareSync(password, user.passwordHash)))
     throw new Error('שם משתמש או סיסמא לא נכונים')
    const requestId = await sendOtp(user.phoneNumber);
    if (!requestId) return res.sendStatus(400).send('המשתמש נחסם, נא נסו להתחבר שנית בעוד 10 דקות')
    const otp = { requestId, email: user.email };
     res.status(200).json(otp)
}
))

// verify 2FA
accountRouter.post('/verify', asyncHandler(async (req, res) => {
  console.log('Verify 2FA');
  const { email, code, requestId } = req.body
  if (!(email && code && requestId)) return res.sendStatus(401)
  const user = await getUserByMail(email)
  const success = await VerifyOtp(code, requestId);
  if (!success) return res.status(400).send('שגיאה בהתחברות')
  const userObject = await CreateUserObject(user, req.cookies)
  console.log(userObject);
  res.cookie("jwt", userObject.token, {
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
  })
  res.status(200).json(userObject)
}
))

// Resend 2FA
accountRouter.post('/ResendOTP', asyncHandler(async (req, res) => {
  const { email, requestId } = req.query
  if (!email) return res.sendStatus(401)
  const user = await getUserByMail(email)
  if (!user) return res.sendStatus(400).send('מייל שגוי')
  await cancelOtp(requestId)
  const requestIdNew = await sendOtp(user.phoneNumber);
  console.log('requestIdNew: ' + requestIdNew);
  if (!requestIdNew) return res.sendStatus(400).send('המשתמש נחסם, נא נסו להתחבר שנית בעוד 10 דקות')
  const otp = { requestId: requestIdNew, email: user.email };
  res.status(200).json(otp)
}
))


// Make Admin
accountRouter.put('/roles/admin',authorization, isAdmin,asyncHandler(async (req, res) => {
  const query = req.query
  const isSuccess = await setRole(query.userEmail, 'Admin')
  res.send(isSuccess)
}))

// Make Implementor
accountRouter.put('/roles/implementor', authorization, isAdmin, asyncHandler(async (req, res) => {
  const query = req.query
  const isSuccess = await setRole(query.userEmail, 'Implementor')
  res.send(isSuccess)
}))


// Logout
accountRouter.post('/logout', asyncHandler(logout))





export default accountRouter