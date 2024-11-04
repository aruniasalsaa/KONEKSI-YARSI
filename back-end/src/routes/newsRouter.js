const express = require("express");
const { validateNews } = require("../middlewares/newsMiddleware");
const { addNews, readNews } = require("../controllers/newsController");
const { uploadOption } = require("../utils/fileUpload");

const router = express.Router();

router.post("/", uploadOption.single("image"), validateNews, addNews);

router.get("/", readNews);

module.exports = router;
