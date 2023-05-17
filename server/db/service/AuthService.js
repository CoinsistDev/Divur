import * as RefreshTokenDal from '../dal/refreshToken.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const bcryptSalt = process.env.BCRYPT_SALT;


export const create = (payload) => {
    const date = new Date()
    date.setDate(date.getDate() + 10);
    payload.expires = date
    return RefreshTokenDal.create(payload)
}

export const createOrUpdate = (payload) => {
    return RefreshTokenDal.createOrUpdate(payload)
}

export const createOrUpdateNew = (user, refreshToken) => {
    const expires = new Date()
    expires.setDate(expires.getDate() + 7);
    return RefreshTokenDal.createOrUpdateNew(user, refreshToken, expires)
}

export const getByUserId = (userId) => {
    return RefreshTokenDal.getByUserId(userId)
}

export const getByRefreshToken = (token) => {
    return RefreshTokenDal.getByRefreshToken(token)
}


export const deleteToken = (userId) => {
    return RefreshTokenDal.deleteByUserId(userId)
}


export const generateRefreshToken = async () => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
    return { hash, resetToken }
}
