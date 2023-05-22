export const toDepartment = (Department)=> {
    return {
        id: Department.id,
        name: Department.name,
        remainingMessages: Department.remainingMessages,
        remainingSMSMessages: Department.remainingSMSMessages,
        apiKey: Department.apiKey,
        apiSecret: Department.apiSecret,
        userName: Department.userName
    }
}

export const toDepartmentDetails = (Department) => {
    const users = toUserDetails(Department.users)
    const scheduledDistributionTasks = toScheduledDistributionTasks(Department.scheduled_distribution_tasks)
    const phoneNumbers = toPhoneNumber(Department.phone_numbers)
    return {
        id: Department.id,
        name: Department.name,
        remainingMessages: Department.remainingMessages,
        remainingSMSMessages: Department.remainingSMSMessages,
        totalNonTicketSent: 0,
        totalNonTicketMessageDelivered: 0,
        totalNonTicketMessageRead: 0,
        totalNonTicketMessageFailed: 0,
        totalBlackListMessage: 0,
        users,
        scheduledDistributionTasks,
        phoneNumbers
    }
}

export const toDepartmentDetailsWithoutMessage = (Department) => {
    const users = toUserDetails(Department.users)
    const phoneNumbers = toPhoneNumber(Department.phone_numbers)
    return {
        id: Department.id,
        name: Department.name,
        remainingMessages: Department.remainingMessages,
        remainingSMSMessages: Department.remainingSMSMessages,
        users,
        phoneNumbers
    }
}

export const toMinimalDepartmentDetails = (Department) => {
    return {
        id: Department.id,
        name: Department.name,
        remainingMessages: Department.remainingMessages,
        remainingSMSMessages: Department.remainingSMSMessages
    }
}

export const toDepartmentsDet = (Department) => {
    const users = toUserDetails(Department.users)
    const scheduledDistributionTasks = toScheduledDistributionTasks(Department.scheduled_distribution_tasks)
    const phoneNumbers = toPhoneNumber(Department.phone_numbers)
    return {
        id: Department.id,
        name: Department.name,
        remainingMessages: Department.remainingMessages,
        remainingSMSMessages: Department.remainingSMSMessages,
        users,
        scheduledDistributionTasks,
        phoneNumbers
    }
}

export const toDepartmentKeys = (Department) => {
    return {
        apiKey: Department.apiKey,
        apiSecret: Department.apiSecret,
        userName: Department.userName,
        subDomain: Department.subDomain
    }
}


export const toUserDetails = (users) => {
    const fixUser = users.map((user) => ({
        displayName: user.displayName,
        userName: user.userName,
        email: user.email,
        roles: []
    }))
    return fixUser
}

export const toScheduledDistributionTasks = (task) => {
    const fixTask = task.map((task) => ({
        id: task.id,
        taskId: task.id,
        createdAt: task.createdAt.toISOString().replace('Z', ''),
        scheduledFor: task.scheduledFor.toISOString().replace('Z', ''),
        status : task.status,
        department : task.departmentId,
        distributor : task.distributor,
        distributionTitle : task.distributionTitle

    }))
    return fixTask
}

export const toUserDepartment = (Department) => {
    return {
        userId: Department.userId,
        departmentId: Department.departmentId,
    }
}

const toPhoneNumber= (phone_numbers) => {
    return phone_numbers.map(phone => ({
        phone: phone.PhoneNumber,
    }))
}
