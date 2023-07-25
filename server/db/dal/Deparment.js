import { Department, User, UserDepartment, MessageLog, ScheduledDistributionTask, PhoneNumber, Role } from '../models/index.js'



export const create = async (payload) => {
    const ignoreClient = await Department.create(payload)
    return ignoreClient
}

export const getAll = async () => {
    //return Department.findAll()
    const dep = await Department.findAll({
        attributes: ['id', 'name', 'remainingMessages', 'remainingSMSMessages', 'apiKey', 'apiSecret', 'userName'],
        include: [
            {
                model: User,
                attributes: ['displayName', 'userName', 'email'],
                include: {
                    model: Role,
                    attributes: ['id'],
                }
            },
            {
                model: ScheduledDistributionTask,
                attributes: ['id', 'createdAt', 'scheduledFor', 'status', 'departmentId']
            },
            {
                model: PhoneNumber,
                attributes: ['PhoneNumber']
            }
        ]
    })
    if (!dep) throw new Error('not found')
    return dep
}

export const getAllUserDepartment = async () => {
    return UserDepartment.findAll()
}

export const getAllSpecificUserDepartment = async (userId) => {
    return UserDepartment.findAll({ where: { userId } })
}

export const getDetails = async (id) => {
    const dep = await Department.findByPk(id, {
        attributes: ['id', 'name', 'remainingMessages', 'remainingSMSMessages', 'apiKey', 'apiSecret', 'userName', 'subDomain'],
        include: [
            {
                model: User,
                attributes: ['displayName', 'userName', 'email'],
                include: {
                    model: Role,
                    attributes: ['id'],
                }
            },
            {
                model: ScheduledDistributionTask,
                // attributes: ['id', 'createdAt', 'scheduledFor', 'status', 'departmentId', 'distributor', 'distributionTitle']
            },
            {
                model: PhoneNumber,
                attributes: ['PhoneNumber']
            },
        ]
    })
    if (!dep) throw new Error('not found')
    return dep
}


export const getDepartmentById = async (id) => {
    const dep = await Department.findByPk(id, {
        attributes: ['id', 'name', 'remainingMessages', 'remainingSMSMessages', 'apiKey', 'apiSecret', 'userName', 'subDomain'],
        include: [
            {
                model: User,
                attributes: ['displayName', 'userName', 'email'],
                include: {
                    model: Role,
                    attributes: ['id'],
                }
            },
            {
                model: PhoneNumber,
                attributes: ['PhoneNumber']
            },
        ]
    })
    if (!dep) throw new Error('not found')
    return dep
}


export const update = async (payload) => {
    const dep = await Department.findByPk(payload.id)
    if (!dep) {
        throw new Error('not found')
    }

    return dep.update(payload)
}

export const getDepartmentKeys = async (apiKey) => {
    const DepartmentInfo = await Department.findOne({ where: { apiKey } })
    if (!DepartmentInfo) {
        throw new Error('not found')
    }
    return DepartmentInfo
}

export const addUser = async (payload) => {
    const dep = await Department.findByPk(payload.departmentId)
    if (!dep) throw new Error('not found department')
    const user = await User.findOne({ where: { userName: payload.username } })
    if (!user) throw new Error('not found user')
    return await UserDepartment.create({ userId: user.id, departmentId: payload.departmentId })
    //return await dep.setUsers(user)
}

export const addPhone = async (departmentId, phoneNumber) => {
    const dep = await Department.findByPk(departmentId)
    if (!dep) throw new Error('not found department')
    //const [phone, isExist] = await PhoneNumber.findOrCreate({ where: { departmentId, PhoneNumber: phoneNumber }})
    const isExist = await PhoneNumber.findOne({ where: { departmentId, PhoneNumber: phoneNumber }})
    if (!isExist)
    PhoneNumber.create({departmentId, PhoneNumber: phoneNumber})
    return isExist
}

export const deleteById = async (id) => {
    const deletedDepartmentCount = await Department.destroy({
        where: { id }
    })
    return !!deletedDepartmentCount
}

export const deleteUser = async (payload) => {
    const department = await Department.findByPk(payload.departmentId)
    if (!department) throw new Error('not found department')
    const user = await User.findOne({ where: { userName: payload.username } })
    if (!user) throw new Error('not found user')
    const isDeleted = await department.removeUser(user)
    return !!isDeleted
}

export const getById = async (id) => {
    const department = await Department.findByPk(id)
    if (!department) throw new Error('not found department')
    return department
}

export const getAllDepartmentsId = async () => {
    const dep = await Department.findAll({
        attributes: ['id'],
    })
    if (!dep) throw new Error('not found')
    return dep
}

export const decrementMessage = async (payload) => {
    const dep = await Department.decrement(payload.field, { by: payload.count, where: { id: payload.departmentId }});
    if (!dep) {
        throw new Error('not found')
    }
    return dep
}

export const incrementMessage = async (payload) => {
    const dep = await Department.increment(payload.field, { by: payload.count, where: { id: payload.departmentId }});
    if (!dep) {
        throw new Error('not found')
    }
    return dep
}