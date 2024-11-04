const express = require("express");
const { validateEvent } = require("../middlewares/eventMiddleware");
const { addEvent, readEvent } = require("../controllers/eventController");
const { uploadOption } = require("../utils/fileUpload");

const router = express.Router();

router.post("/", uploadOption.single("image"), validateEvent, addEvent);

router.get("/", readEvent);

module.exports = router;
