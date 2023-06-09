import { Router } from 'express'
import asyncHandler from "express-async-handler"
import * as departmentsController from '../controllers/departments/index.js'
import { isAdmin, authorization, isAdminOrImplementor, isDepartmentUser } from '../../middleware/authMiddleware.js'



const departmentRouter = Router()

//  Create
departmentRouter.post('/',authorization, isAdminOrImplementor, asyncHandler(async (req, res) => {
  const result = await departmentsController.addDepartment(req.body)
  res.status(201).send(result)
}))

// Edit
departmentRouter.put('/', authorization, isAdminOrImplementor, asyncHandler(async (req, res) => {
  const payload = req.body
  const result = await departmentsController.update(payload)
  res.send(result)
}))

//List
departmentRouter.get('/UserDepartment', asyncHandler(async (req, res) => {
  const result = await departmentsController.getAllUserDepartment()
  res.send(result)
}))

//List of department for spesific user
departmentRouter.get('/UserDepartment/:userId', asyncHandler(async (req, res) => {
  const result = await departmentsController.getAllSpecificUserDepartment(req.params.userId)
  res.send(result)
}))

//  List All
departmentRouter.get('/', authorization, isAdminOrImplementor, asyncHandler(async (req, res) => {
  const result = await departmentsController.getAll()
  res.send(result)
}))

// Details
departmentRouter.get('/:id',authorization, asyncHandler(async (req, res) => {
  const result = await departmentsController.getDetails(req.params.id)
  res.status(200).send(result)
}))


// Get CannedReplies
departmentRouter.get('/cannedreplies/:id', authorization, isDepartmentUser, asyncHandler(async (req, res) => {
  const result = await departmentsController.cannedReplies(req.params.id, false)
  res.send(result)
}))

// Add User
departmentRouter.post('/adduser',authorization, isAdminOrImplementor, asyncHandler(async (req, res) => {
  const result = await departmentsController.adduser(req.body)
  res.send(result)
}))


// Delete User Department
departmentRouter.post('/deleteuser', authorization, isAdminOrImplementor, asyncHandler(async (req, res) => {
  const result = await departmentsController.deleteUser(req.body)
  res.send(result)
}))

// Delete Department
departmentRouter.delete('/:id', asyncHandler(async (req, res) => {
  const result = await departmentsController.deleteById(req.params.id)
  res.send(result)
}))

//Add Phone Number
departmentRouter.post('/phones/:id', asyncHandler(async (req, res) => {
  const result = await departmentsController.addPhone(req.params.id, req.body.phoneNumber)
  res.send(result)
}))

export default departmentRouter