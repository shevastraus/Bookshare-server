const express = require("express");
const router = express.Router();
const app = express();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

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

router.post("/", (req, res) => {
  const usersData = readData("./data/users.json");

  const usersBookshelf = readData("./data/bookshelves.json");

  let { user_name, email, password, latitude, longitude } = req.body;

  email = email.toLowerCase();

  // If any fields are missing, return
  // if (!user_name || !email || !password) {
  //   console.log("Fields are empty");
  //   return res.status(400).send("All fields are required");
  // }

  // If address is invalid, return
  // if (!latitude || !longitude) {
  //   return res.status(400).send("Please provide a valid address.");
  // }

  // If password is less than six characters, return
  // if (password.length < 6) {
  //   return res
  //     .status(400)
  //     .send("Passwords must be a minimum of six characters");
  // }

  // if an account with the email address already exists, return
  // const foundAccount = usersData.find((user) => user.email === email);
  // if (foundAccount) {
  //   return res.status(400).send("An account with this email already exists.");
  // }

  // if an account with the same geolocation exists, shift the pin slightly over
  // let foundLat = usersBookshelf.find(
  //   (bookshelf) => bookshelf.latitude === latitude
  // );
  // let foundLong = usersBookshelf.find(
  //   (bookshelf) => bookshelf.longitude === longitude
  // );

  // if (foundLat && foundLong) {
  //   do {
  //     latitude = latitude + 0.00015;
  //     longitude = longitude + 0.00015;
  //     foundLat = usersBookshelf.find(
  //       (bookshelf) => bookshelf.latitude === latitude
  //     );
  //     foundLong = usersBookshelf.find(
  //       (bookshelf) => bookshelf.longitude === longitude
  //     );
  //   } while (foundLat && foundLong);
  // }

  bcrypt
    .hash(password, 8)
    .then((hashedPassword) => {
      const newUser = {
        user_id: uuid.v4(),
        user_name,
        email,
        password: hashedPassword,
        bookshelf_id: uuid.v4(),
      };
      const newUserBookshelf = {
        bookshelf_id: newUser.bookshelf_id,
        latitude,
        longitude,
        books: [],
      };

      usersData.push(newUser);
      writeData(usersData, "./data/users.json");

      usersBookshelf.push(newUserBookshelf);
      writeData(usersBookshelf, "./data/bookshelves.json");
    })
    .then(() => {
      res.status(201).send("Registration successful! Welcome!");
    })
    .catch(() => {
      res.status(400).send("Registration failed. Please try again.");
    });
});

module.exports = router;
