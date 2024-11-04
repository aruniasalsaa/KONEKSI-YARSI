const multer = require("multer");

const FILE_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFormat = FILE_TYPE[file.mimetype];
    let uploadError = new Error("Invalid Image Type");

    if (isValidFormat) {
      uploadError = null;
    }

    cb(uploadError, "./src/public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extention = FILE_TYPE[file.mimetype];
    const uniqueFileImage = fileName + "-" + Date.now() + "." + extention;

    cb(null, uniqueFileImage);
  },
});

// const upload = multer({ storage: storage });
exports.uploadOption = multer({ storage: storageFile });
