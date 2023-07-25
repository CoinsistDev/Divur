import { Role,  UserRole } from '../models/index.js'


export const create = async (payload) => {
    const userRole = await UserRole.create(payload)
    return userRole
}

export const getRoleId = async (role)=> {
    const roleDetail = await Role.findOne({ where: { normalizedName: role } })
    if (!roleDetail) {
        throw new Error('Role not found')
    }
    return roleDetail
}

export const getUserRole = async (user_id) => {
    const roleDetail = await UserRole.findOne({ where: { user_id } })
    if (!roleDetail) {
        throw new Error(`User ${user_id} not found in UserRole`)
    }
    return roleDetail
}

export const getRole = async (id) => {
    const roleDetail = await Role.findOne({ where: { id } })
    if (!roleDetail) {
        throw new Error(`Role ${id} not found in UserRole`)
    }
    return roleDetail
}