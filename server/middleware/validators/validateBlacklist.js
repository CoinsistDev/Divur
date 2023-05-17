import { check, oneOf } from "express-validator";

export const validateBlacklist = [
    check('id')
       .isUUID()
        .exists()
        .withMessage('Incorrect departmentId')
        .bail(),
    check('File')
        .bail()

];