import multer from 'multer'
import path from 'path'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../resources/images')
    },
    filename: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif|svg/
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
        cb(null, file.fieldname + '-' + Date.now() + `.${extName}`)
    }
  })

var upload = multer({ storage: storage })

export {storage, upload}