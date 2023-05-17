import * as service from '../../../db/service/DeparmentService.js'
import * as mapper from './mapper.js'

export const addDepartment = async (payload) => {
  return mapper.toDepartment(await service.addDepartment(payload))
}

export const getAllUserDepartment = async () => {
  return (await service.getAllUserDepartment()).map(mapper.toUserDepartment)
}

export const getAllSpecificUserDepartment = async (userId) => {
  return (await service.getAllSpecificUserDepartment(userId)).map(mapper.toUserDepartment)
}

export const update = async (payload) => {
  return mapper.toDepartment(await service.update(payload))
}

export const getTags = async (departmentId) => {
  return await service.getGlassixTags(departmentId)
}

export const cannedReplies = async (departmentId) => {
  return await service.getGlassixCannedReplies(departmentId)
}

export const adduser = async (payload) => {
  return mapper.toDepartment(await service.adduser(payload))
}

export const addPhone = async (departmentId, phoneNumber) => {
  return await service.addPhone(departmentId, phoneNumber)
}

export const deleteUser = async (payload) => {
  return await service.deleteUser(payload)
}

export const getAll = async () => {
  return (await service.getAll()).map(mapper.toDepartmentsDet)
}

export const getDetails = async (id) => {
 return mapper.toDepartmentDetails((await service.getDetails(id)))
// return await service.getDetails(id)
}

export const getMinimalDetails = async (id) => {
  return mapper.toMinimalDepartmentDetails((await service.getById(id)))
 }

 export const getDepartmentDetails = async (id) => {
  return mapper.toDepartmentDetailsWithoutMessage((await service.getDepartmentById(id)))
 }

export const getKeys = async (id) => {
  return mapper.toDepartmentKeys((await service.getKeys(id)))
 }

export const deleteById = async (id) => {
  const isDeleted = await service.deleteById(id)
  return isDeleted
}