import { RefreshToken } from '../models/index.js'

export const create = async (payload) => {
    const refreshToken = await RefreshToken.create(payload)
    return refreshToken
}

export const createOrUpdate = async (payload) => {
    const refreshToken = await RefreshToken.findOne({ where: { userId: payload.userId } })
    if (!refreshToken) {
        return await RefreshToken.create(payload)
    }
    return await refreshToken.update(payload)
}

export const createOrUpdateNew = async (user, refreshToken, expires) => {
    const refresh = await RefreshToken.findOne({ where: { userId: user.id } })
    if (!refresh) {
        return await RefreshToken.create({token: refreshToken, expires, userId: user.id})
    }
    return await refresh.update({token: refreshToken, expires})
}


export const getByUserId = async (userId) => {    
    const refreshToken = await RefreshToken.findOne({ where: { userId } })
    return refreshToken
}

export const getByRefreshToken = async (token) => {    
    const refreshToken = await RefreshToken.findOne({ where: { token } })
    return refreshToken
}


export const deleteByUserId = async (userId)=> {
    const deletedrefreshToken = await RefreshToken.destroy({ where: { userId } })
    return !!deletedrefreshToken
}