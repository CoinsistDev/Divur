import { check, oneOf } from "express-validator";

export const validateSend = [
    check('From')
        .exists()
        .isString()
        .withMessage('נא להכניס מספר שולח')
        .isLength({ min: 10, max: 13 })
        .withMessage('נא להכניס מספר בין 10 - 13 ספרות')
        .bail(),
    check('Message')
        .exists()
        .isString()
        .notEmpty()
        .withMessage('נא להכניס תבנית הודעה')
        .bail(),
    check('Parameters')
        .exists()
        .isString()
        .withMessage('נא להכניס פרמטרים')
        .bail(),
    oneOf([
        check('protocolType').equals('WhatsApp'),
        check('protocolType').equals('SMS'),
    ], 'Incorrect protocol type please specify SMS or WhatsApp'),
    check('isInternational')
        .exists()
        .toBoolean()
        .isBoolean()
        .withMessage('נא לבחור בין דיוור לישראל או בינלאומי')
        .bail(),
    check('imageUrl')
        .isURL().optional({nullable: true})
        .withMessage('נא להכניס קישור תקין')
        .bail(),
    check('ScheduleDate')
        //.not()
        .toDate().optional({nullable: true})
        // .withMessage('נא להכניס תאריך תקין')
        .bail(),
    check('departmentId')
       .isUUID()
        .exists()
        .withMessage('Incorrect departmentId')
        .bail(),
    check('File')
        .bail()

];