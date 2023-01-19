const express = require("express");
const cors = require("cors");
const users = require("./routes/users");
const geolocation = require("./routes/geolocation");
const checksignup = require("./routes/checksignup");
const signup = require("./routes/signup");
const login = require("./routes/login");
const bookshelves = require("./routes/bookshelves");
const book = require("./routes/book");
const app = express();

//Configuration
require("dotenv").config();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/", express.static("public"));
app.use("/users", users);
app.use("/geolocation", geolocation);
app.use("/checksignup", checksignup);
app.use("/signup", signup);
app.use("/login", login);
app.use("/bookshelves", bookshelves);
app.use("/book", book);

// start the server
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
