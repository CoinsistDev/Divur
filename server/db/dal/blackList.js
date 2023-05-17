import { BlackList } from '../models/index.js'

export const create = async (payload) => {
    const [ignoreClient] = await BlackList.findOrCreate({
        where: { departmentId: payload.departmentId, phoneNumber: payload.phoneNumber }})
    return ignoreClient
}


export const getByPhone = async (phoneNumber, departmentId) => {
    const ignoreClient = await BlackList.findOne({ where: { phoneNumber, departmentId } })
    if (!ignoreClient) {
        throw new Error('not found')
    }
    return ignoreClient
}

export const deleteByPhone = async (phoneNumber, departmentId) => {   
    const deletedBlackList = await BlackList.destroy({
        where: { phoneNumber, departmentId }
    })

    return !!deletedBlackList
}


export const deleteByPk = async (id) => {   
    const deletedBlackList = await BlackList.findByPk(id)
    deletedBlackList.destroy()
    return !!deletedBlackList
}

export const getAll = async (departmentId, page) => {
    if (typeof page !== "undefined"){
        const limit = 30
         const offset = limit * page;
         const  { count, rows } = await  BlackList.findAndCountAll({
             where: { departmentId },
              offset,
              limit
     })
        return rows
    }else{
        return BlackList.findAll({
           where: { departmentId }
      })
}
}

export const addBulkBlacklist = async (bulk) => {
    return BlackList.bulkCreate(bulk)
}

