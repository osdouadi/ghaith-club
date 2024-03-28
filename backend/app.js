const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const eventRouter = require("./routes/eventRoutes");
const bannerRouter = require("./routes/bannerRoutes");
const gallaryRouter = require("./routes/gallaryRoutes");


app.use(cors());
app.options("*", cors);

require("dotenv/config");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/banners", bannerRouter);
app.use("/api/v1/gallaries", gallaryRouter);

// Database
mongoose
  .connect(process.env.DATABASE, {
    dbName: "ghaithClub",
  })
  .then(() => {
    console.log("Database connection is ready...");
  })
  .catch((error) => {
    console.log("Database connection failed", error);
  });

//app.listen(process.env.PORT, () => {
//  console.log(`server is running on port ${process.env.PORT}`);
//});

server.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
