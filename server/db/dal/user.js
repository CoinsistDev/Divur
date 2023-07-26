import { Role, User, UserDepartment, Department, UserRole, RefreshToken } from '../models/index.js';
import { generate } from 'generate-password';
import { Op } from 'sequelize';

export const create = async (departmentId, payload) => {
  payload.lastDepartmentVisited = departmentId;
  payload.passwordHash = generate({ length: 32, numbers: true });
  delete Object.assign(payload, { phoneNumber: payload.phone }).phone;
  const [user, created] = await User.findOrCreate({
    where: {
      [Op.or]: [{ phoneNumber: payload.phoneNumber }, { userName: payload.userName }, { email: payload.email }],
    },
    defaults: payload,
  });
  if (!created) throw new Error('user details already taken');
  user.setAttributes;
  return user;
};

export const createUserDepartment = async (departmentId, userId) => {
  const client = await UserDepartment.create({ userId, departmentId });
  // return client
};

export const updateOne = async (payload) => {
  const user = await User.findByPk(payload.id);
  if (!user) {
    //@todo throw custom error
    throw new Error('not found');
  }

  return user.update(payload);
};

export const getUser = async (email) => {
  const UserInfo = await User.findOne({ where: { email }, include: [Role, Department] });
  if (!UserInfo) {
    throw new Error(`Email ${email} does not exist`);
  }
  return UserInfo;
};

export const getUserById = async (id) => {
  const UserInfo = await User.findOne({ where: { id } });
  if (!UserInfo) {
    throw new Error(`User ${id} does not exist`);
  }
  return UserInfo;
};

export const getUserByIdAll = async (id) => {
  const UserInfo = await User.findByPk(id, { include: [Role, Department] });
  if (!UserInfo) {
    throw new Error(`User ${id} does not exist`);
  }
  return UserInfo;
};

export const getUserByUsername = async (userName) => {
  const UserInfo = await User.findOne({ where: { userName } });
  if (!UserInfo) {
    throw new Error(`User with userName ${userName} does not exist`);
  }
  return UserInfo;
};

export const deleteById = async (id) => {
  await UserDepartment.destroy({ where: { userId: id } });
  await UserRole.destroy({ where: { userId: id } });
  const deletedUserCount = await User.destroy({ where: { id } });
  return !!deletedUserCount;
};

export const deleteByEmail = async (email) => {
  const deletedUserCount = await User.destroy({ where: { email } });
  return !!deletedUserCount;
};

export const getRoles = async (userId) => {
  const users = await User.findOne({
    where: {
      id: userId,
    },
    attributes: ['id'],
    include: {
      model: Role,
      attributes: ['name'],
    },
  });
  return users;
};

export const getDepartments = async (userId) => {
  const departments = await User.findOne({
    where: {
      id: userId,
    },
    attributes: ['id'],
    include: {
      model: Department,
      attributes: ['name', 'id'],
    },
  });
  return departments;
};

export const createUserRole = async (userId, roleId) => {
  const client = await UserRole.create({ userId, roleId });
  return client;
};

export const getRoleNum = async (role) => {
  const RoleInfo = await Role.findOne({ where: { name: role } });
  if (!RoleInfo) {
    throw new Error('Role id does not exist');
  }
  return RoleInfo.id;
};

export const editUser = async (userId, departmentId) => {
  const dep = await User.findByPk(userId);
  if (!dep) {
    throw new Error('not found user');
  }

  return dep.update({ lastDepartmentVisited: departmentId });
};

export const updatePhoneNumber = async (userId, phone) => {
  const dep = await User.findByPk(userId);
  if (!dep) {
    throw new Error('not found user');
  }

  return !!dep.update({ phoneNumber: phone });
};

export const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: [{
        model: Department,
        required: false,
        attributes: ['name'], 
    }]
})
  if (!users) throw new Error('not found');
  return users;
};
