const express = require("express"); // IMPORT MODULE EXPRESS
const dotenv = require("dotenv"); // IMPORT MODULE .ENV
const { PrismaClient } = require("@prisma/client"); // IMPROT MODULE ORM PRISMA
const AuthRouter = require("./routes/AuthRouter");
const CategoriesRouter = require("./routes/categories");
const NewsRouter = require("./routes/newsRouter");
const EventRouter = require("./routes/eventRouter");
const HomepageRouter = require("./routes/homePageRouter");
const ProductRouter = require("./routes/productsRouter");
const cookieParser = require("cookie-parser");
const morgan = require("morgan"); // IMPORT MODULE MORGAN UNTUK MIDDLEWARE LOGGING
const cors = require("cors");
const path = require("path");

const prisma = new PrismaClient();
const app = express();

dotenv.config();
const PORT = process.env.PORT;

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); //MIDDLEWARE UNTUK LOGGING
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(
  "/public/uploads",
  express.static(path.join(__dirname + "/public/uploads"))
); // agar bisa membuka file gambar

//ROUTING
app.use("/api/v1/categories", CategoriesRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/news", NewsRouter);
app.use("/api/v1/event", EventRouter);
app.use("/api/v1/homepage", HomepageRouter);

//SERVER
app.listen(PORT, () =>
  console.log(`Express API sudah jalan pada port: ${PORT}`)
);
