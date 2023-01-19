const express = require("express");
const router = express.Router();
const app = express();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Middleware
app.use(express.json());

// read the data file
function readUsersData() {
  const usersFile = fs.readFileSync("./data/users.json");
  const usersDataParse = JSON.parse(usersFile);
  return usersDataParse;
}

router.get("/", (req, res) => {
  res.send("Server is up and running!");
});

router.post("/", (req, res) => {
  const usersData = readUsersData();
  let { email, password } = req.body;
  // If any fields are missing, return
  if (!email || !password) {
    return res.status(400).send("All fields are required");
  }

  email = email.toLowerCase();

  const foundUser = usersData.find((user) => user.email === email);

  if (foundUser) {
    const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordCorrect)
      return res.status(400).send("Invalid password. Please try again.");
    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  } else {
    return res
      .status(400)
      .send("Email not found. Create an account to get started!");
  }
});

module.exports = router;
