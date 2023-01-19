const express = require("express");
const router = express.Router();
const app = express();
const fs = require("fs");
const jwt = require("jsonwebtoken");

// Middleware
app.use(express.json());

// read the NEW data file
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
  // If no auth header is sent
  if (!req.headers.authorization) return res.status(401).send("Please login");

  // const usersData = readUsersData();
  const usersData = readData("./data/users.json");
  const bookshelfData = readData("./data/bookshelves.json");

  // Parse the JWT
  const authToken = req.headers.authorization.split(" ")[1];

  //Verify JWT
  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid authorization token");

    //Find the user
    const foundUser = usersData.find((user) => user.email === decoded.email);
    let { user_id, user_name, email, bookshelf_id } = foundUser;

    const foundBookshelf = bookshelfData.find(
      (bookshelf) => bookshelf.bookshelf_id === bookshelf_id
    );

    res.json({ user_id, user_name, email, foundBookshelf });
  });
});

router.post("/", (req, res) => {
  const usersBookshelf = readData("./data/bookshelves.json");

  const newBook = {
    title: req.body.title,
    author: req.body.author,
    image: req.body.image,
    genre: req.body.genre,
    available: true,
  };

  const bookshelf_id = req.body.bookshelf_id;

  const foundBookshelf = usersBookshelf.find(
    (bookshelf) => bookshelf.bookshelf_id === bookshelf_id
  );

  foundBookshelf.books.push(newBook);

  writeData(usersBookshelf, "./data/bookshelves.json");

  return res.status(201).send(usersBookshelf);
});

module.exports = router;
