import * as blackListDal from '../dal/blackList.js'

export const addClient = async (payload)=> {
    return blackListDal.create(payload)
}

export const getByPhone = async (phoneNumber, departmentId) => {
    return await blackListDal.getByPhone(phoneNumber, departmentId)
}

export const deleteByPhone = (phoneNumber, departmentId) => {
    return blackListDal.deleteByPhone(phoneNumber, departmentId)
}

export const deleteByPk = (id) => {
    return blackListDal.deleteByPk(id)
}

export const getAll = (departmentId, page) => {
    return blackListDal.getAll(departmentId, page)
}


export const addBulkBlacklist = (bulk) => {
    return blackListDal.addBulkBlacklist(bulk)
}