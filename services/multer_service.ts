import multer from "multer";
import path from "path";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../resources/public/avatarImages");
  },
  filename: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif|svg/;
    const extName = path.extname(file.originalname).toLowerCase();
    var error: Error | null = null;
    if (!fileTypes.test(extName)) {
      error = new Error("File không hợp lệ");
    }
    cb(error, file.fieldname + "-" + Date.now() + extName);
  },
});

var upload = multer({ storage: storage });

export { storage, upload };
