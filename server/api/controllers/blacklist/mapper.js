
export const toBlackList = (BlackList) => {
    let fixPhone = BlackList.phoneNumber
    if (fixPhone.startsWith('0'))
         fixPhone  =   fixPhone.replace('0', '972')
     fixPhone = fixPhone.replaceAll(' ', '').replaceAll('+', '')
    return {
        id: BlackList.id,
        departmentId: BlackList.departmentId,
        phone: fixPhone,
        createdAt: BlackList.createdAt
    }
}