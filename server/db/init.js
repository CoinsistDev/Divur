import dotenv from 'dotenv'
import { Role, User, Department, BlackList, UserDepartment, UserRole, RefreshToken, MessageLog, PhoneNumber, ScheduledDistributionTask } from './models/index.js'

dotenv.config()

const isDev = process.env.NODE_ENV === 'development'

const dbInit = async () => Promise.all([
  await Role.sync({ alter: isDev }),
  await User.sync({ alter: isDev }),
  await RefreshToken.sync({ alter: isDev }),
  await Department.sync({ alter: isDev }),
  await BlackList.sync({ alter: isDev }),
  await UserRole.sync({ alter: isDev }),
  await UserDepartment.sync({ alter: isDev }),
  await MessageLog.sync({ alter: isDev }),
  await PhoneNumber.sync({ alter: isDev }),
  await ScheduledDistributionTask.sync({ alter: isDev }),
])

// const dbInit = async () => Promise.all([
//   await Role.sync({ force: true }),
//   await User.sync({ force: true }),
//   await RefreshToken.sync({ force: true }),
//   await Department.sync({ force: true }),
//   await BlackList.sync({ force: true }),
//   await UserRole.sync({ force: true }),
//   await UserDepartment.sync({ force: true }),
//   await MessageLog.sync({ force: true }),
//     await PhoneNumber.sync({ force: true }),
//   await ScheduledDistributionTask.sync({ force: true }),
//   // initHooks()
// ])

export default dbInit 


// addPosts
// setPosts
// countPosts
// removePost