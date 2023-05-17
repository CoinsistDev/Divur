import multer from 'multer'

const fileStorage = multer.memoryStorage()

const fileFilter = (
    request,
    file,
    callback
) => {
    if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel.sheet.binary.macroEnabled.12' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.ms-excel.sheet.macroEnabled.12'
    ) {  
        callback(null, true)
    } else {        
        return callback(new Error('Only Excel allowed'));
    }
}

const fileLimit = {
    fileSize: 1024 * 1024 * 10 // limits the file size to 10MB
};


const upload = multer({
    storage: fileStorage,
    limits: fileLimit,
    fileFilter: fileFilter
});

const fileUpload = upload.single('File')

export { fileUpload }
