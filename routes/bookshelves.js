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

router.get("/", (req, res) => {
  // If no auth header is sent

  if (!req.headers.authorization) return res.status(401).send("Please login");

  const bookshelfData = readData("./data/bookshelves.json");
  const userData = readData("./data/users.json");

  //to test this endpoint without auth: --
  // return res.status(200).send(bookshelfData);

  // Parse the JWT

  const authToken = req.headers.authorization.split(" ")[1];

  //Verify JWT
  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid authorization token");
    console.log("decoded JWT: ", decoded);
    const userInfo = userData.find((user) => decoded.email === user.email);
    console.log("found ID: ", userInfo.bookshelf_id);
    const userBookshelf = bookshelfData.find((bookshelf) => {
      bookshelf.bookshelf_id === userInfo.bookshelf_id;
      return { latitude: bookshelf.latitude, longitude: bookshelf.longitude };
    });
    const userCoordinates = {
      lat: userBookshelf.latitude,
      long: userBookshelf.longitude,
    };
    console.log("userCoordinates", userCoordinates);
    neighbourBookshelves = bookshelfData.filter(
      (bookshelf) =>
        bookshelf.bookshelf_id !== userInfo.bookshelf_id &&
        Math.abs(bookshelf.latitude - userCoordinates.lat) < 0.005 &&
        Math.abs(bookshelf.longitude - userCoordinates.long) < 0.005
    );
    console.log("all bookshelves", bookshelfData);
    console.log("neighborBookshelves", neighbourBookshelves);

    res.status(200).send(neighbourBookshelves);
  });
});

router.get("/:bookshelf_id", (req, res) => {
  // If no auth header is sent
  if (!req.headers.authorization) return res.status(401).send("Please login");

  const bookshelfData = readData("./data/bookshelves.json");

  const { bookshelf_id } = req.params;

  // Parse the JWT
  const authToken = req.headers.authorization.split(" ")[1];

  //Verify JWT
  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid authorization token");

    const foundBookshelf = bookshelfData.find(
      (bookshelf) => bookshelf.bookshelf_id === bookshelf_id
    );

    res.status(200).send(foundBookshelf);
  });
});

module.exports = router;
