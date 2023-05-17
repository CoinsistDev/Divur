import jwt from 'jsonwebtoken'
import {getAllSpecificUserDepartment} from '../db/service/DeparmentService.js'

export const authorization = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
        //throw new Error('Not authorized, token faild')
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = data.nameid;
        req.userRole = data.role;
        next();
    } catch {
        return res.status(403);
        //throw new Error('Not authorized, no token')
    }
};

export const isAdmin = (req, res, next) => {
    try {
        if (req.userId && req.userRole === "Admin") {
            next()
        } else {
            res.status(403)
            throw new Error('Not autorized as an admin')
        }
    } catch (error) {
        next(error)
    }
}

export const isAdminOrImplementor = (req, res, next) => {
    if (req.userId && (req.userRole === "Implementor" || req.userRole === "Admin")) {
        next()
    } else {
        res.status(403)
        throw new Error('Not autorized as an Admin or Implementor')
    }
}

export const isDepartmentUser = async(req, res, next) => {
    try {
        const departmentId = req.params.id
        const userId = req.userId
        const departments = await getAllSpecificUserDepartment(userId)
        if (departments.some(e => e.departmentId === departmentId)) {
            next()
        } else {
            res.status(401)
            throw new Error('The current user does not have access to the department')
        }
    } catch (error) {
        next(error)
    }
}