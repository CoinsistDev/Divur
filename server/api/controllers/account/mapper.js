export const toUser = (User) => {
    return {
        id: User.id,
        displayName: User.displayName,
        lastDepartmentVisited: User.lastDepartmentVisited,
        userName: User.userName,
        email: User.email,
        emailConfirmed: User.emailConfirmed,
        passwordHash: User.passwordHash,
        concurrencyStamp: User.concurrencyStamp,
        phoneNumber: User.phoneNumber,
        phoneNumberConfirmed: User.phoneNumberConfirmed,
        twoFactorEnabled: User.twoFactorEnabled,
        lockoutEnd: User.lockoutEnd,
        lockoutEnabled: User.lockoutEnabled,
        accessFailedCount: User.accessFailedCount
    }
}

export const toNewUser = (User) => {
    const departments = toDepartment(User.departments)
    const roles = toRole(User.roles)
    return {
        id: User.id,
        displayName: User.displayName,
        token: '?????',
        userName: User.userName,
        email: User.email,
        lastDepartmentVisited: User.lastDepartmentVisited,
        departments,
        roles
    }
}

export const toRole = (role) => {
    const fixRole = role.map(dep => dep.name)
    return fixRole
}

export const toDepartment = (department) => {
    const fixDep = department.map(depart => ({
        id: depart.id,
        name: depart.name
    }))
    return fixDep
}