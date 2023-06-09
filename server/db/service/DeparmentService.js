import * as DepartmentDal from '../dal/Deparment.js'
import { getCannedReplies } from '../../api/controllers/glassix/index.js'
import CryptoJS  from 'crypto-js'



const cryptoSecret = process.env.CRYPTO_SECRET;

export const addDepartment = async (payload) => {
    const ciphertext = await CryptoJS.AES.encrypt(JSON.stringify(payload.apiSecret), cryptoSecret).toString();
    payload.apiSecret = ciphertext
    const dep = await DepartmentDal.create(payload)
    if (dep)
         payload.phoneNumbers.forEach(phone => addPhone(payload.id, phone.phone));
    return dep
}

export const getAllUserDepartment = async () => {
    return await DepartmentDal.getAllUserDepartment()
}

export const getAllSpecificUserDepartment = async (userId) => {
    const depUser = await DepartmentDal.getAllSpecificUserDepartment(userId)
    return depUser
}

// export const deleteByPhone = (phoneNumber: string, departmentId: string): Promise<boolean> => {
//     return DepartmentDal.deleteByPhone(phoneNumber, departmentId)
// }

export const getAll = async() => {
    const departmentList = await DepartmentDal.getAll()
    return departmentList
}

export const getDetails = async (id) => {
    const department = await DepartmentDal.getDetails(id)
    return department
}

export const getDepartmentById = async (id) => {
    const department = await DepartmentDal.getDepartmentById(id)
    return department
}

export const getKeys = async (id) => {
    const department = await DepartmentDal.getDetails(id)
    return department
}

export const update = async (payload) => {
    payload.phoneNumbers.forEach(phone => addPhone(payload.id, phone.phone));
    return DepartmentDal.update(payload)
}


export const getGlassixCannedReplies = async (departmentId, useCache) => {
    return await getCannedReplies(departmentId, useCache)
}

export const adduser = async (payload) => {
    return DepartmentDal.addUser(payload)
}

export const addPhone = async (departmentId,phoneNumber) => {
    return DepartmentDal.addPhone(departmentId,phoneNumber)
}

export const deleteUser = async (payload) => {
    return DepartmentDal.deleteUser(payload)
}


export const deleteById = (id) => {
    return DepartmentDal.deleteById(id)
}

export const getById = (id) => {
    return DepartmentDal.getById(id)
}

export const updateCountMessage = async (payload, method) => {
    payload.field = payload.protocolType === 'SMS' ? 'remainingSMSMessages' : 'remainingMessages'
    return method === 'Incrementing' ? DepartmentDal.incrementMessage(payload) : DepartmentDal.decrementMessage(payload)
   //  DepartmentDal.decrementMessage(payload)
}