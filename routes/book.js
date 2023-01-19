const express = require("express");
const router = express.Router();
const app = express();
const fs = require("fs");
const jwt = require("jsonwebtoken");

// Middleware
app.use(express.json());

// read the data file
function readData(JsonFile) {
  const file = fs.readFileSync(JsonFile);
  const dataParse = JSON.parse(file);
  return dataParse;
}

// write to the data file
function writeData(data, jsonFile) {
  fs.writeFileSync(jsonFile, JSON.stringify(data));
}

router.get("/", (req, res) => {
  res.send("Server is up and running!");
});

router
  .route("/:bookshelf_id&:title")
  .get((req, res) => {
    // If no auth header is sent
    if (!req.headers.authorization) return res.status(401).send("Please login");

    const usersData = readData("./data/users.json");
    const bookshelfData = readData("./data/bookshelves.json");

    const { bookshelf_id, title } = req.params;

    // Parse the JWT
    const authToken = req.headers.authorization.split(" ")[1];

    //Verify JWT
    jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
      // jwt.verify(authToken, process.env.bookshare-server.herokuapp.com.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).send("Invalid authorization token");

      const foundBookshelf = bookshelfData.find(
        (bookshelf) => bookshelf.bookshelf_id === bookshelf_id
      );

      const foundBook = foundBookshelf.books.find(
        (book) => book.title === title
      );

      // also need owner's email address and user name:

      const foundUser = usersData.find(
        (user) => user.bookshelf_id === bookshelf_id
      );
      const foundUserEmail = foundUser.email;
      const foundUserUsername = foundUser.user_name;

      foundBook.email = foundUserEmail;
      foundBook.user_name = foundUserUsername;

      res.json(foundBook);
    });
  })
  .put((req, res) => {
    // If no auth header is sent
    if (!req.headers.authorization) {
      return res.status(401).send("Please login");
    }

    const bookshelfData = readData("./data/bookshelves.json");

    const { bookshelf_id, title } = req.params;

    // Parse the JWT
    const authToken = req.headers.authorization.split(" ")[1];

    //Verify JWT
    jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).send("Invalid authorization token");

      const foundBookshelf = bookshelfData.find(
        (bookshelf) => bookshelf.bookshelf_id === bookshelf_id
      );

      const foundBook = foundBookshelf.books.find(
        (book) => book.title === title
      );
      foundBook.available = req.body.available;

      const foundBookIndex = foundBookshelf.books.findIndex(
        (book) => book.title === title
      );

      writeData(bookshelfData, "./data/bookshelves.json");
      console.log("Updated book: ", foundBookshelf);
      res.status(201).json(foundBookshelf);
    });
  })
  .delete((req, res) => {
    // If no auth header is sent
    if (!req.headers.authorization) {
      return res.status(401).send("Please login");
    }

    const bookshelfData = readData("./data/bookshelves.json");

    const { bookshelf_id, title } = req.params;

    // Parse the JWT
    const authToken = req.headers.authorization.split(" ")[1];
    console.log("authToken", authToken);

    //Verify JWT
    jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT error! ");
        return res.status(401).send("Invalid authorization token");
      }

      const foundBookshelf = bookshelfData.find(
        (bookshelf) => bookshelf.bookshelf_id === bookshelf_id
      );

      // const foundBook = foundBookshelf.books.find(
      //   (book) => book.title === title
      // );

      const foundBookIndex = foundBookshelf.books.findIndex(
        (book) => book.title === title
      );

      foundBookshelf.books.splice(foundBookIndex, 1);

      writeData(bookshelfData, "./data/bookshelves.json");

      res.json(foundBookshelf);
    });
  });

module.exports = router;
