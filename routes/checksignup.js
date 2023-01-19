const express = require("express");
const router = express.Router();
const app = express();
const fs = require("fs");

// Middleware
app.use(express.json());

// read the data file
function readData(JsonFile) {
  const file = fs.readFileSync(JsonFile);
  const dataParse = JSON.parse(file);
  return dataParse;
}

router.post("/", (req, res) => {
  const usersData = readData("./data/users.json");

  let {
    user_name,
    email,
    isPassword,
    isPassword2,
    passwordMatch,
    passwordLength,
    isAddress,
    isLatitude,
  } = req.body;
  console.log("Req.body: ", req.body);

  if (!user_name) {
    console.log("No user name!");
    return res.status(400).send("Please enter your name");
  }

  if (!email) {
    return res.status(400).send("Please enter your email address");
  }

  if (!isPassword) {
    return res.status(400).send("Please enter a password");
  }
  // If password is less than six characters, return
  if (passwordLength < 6) {
    return res
      .status(400)
      .send("Passwords must be a minimum of six characters");
  }
  if (!isPassword2) {
    return res.status(400).send("Passwords must match");
  }

  // If password inputs don't match, return
  if (!passwordMatch) {
    return res.status(400).send("Passwords must match");
  }

  if (!isAddress) {
    return res.status(400).send("Please enter your full address");
  }

  if (!isLatitude) {
    return res
      .status(400)
      .send("Your address wasn't recogised. Please check it and try again.");
  }

  // if an account with the email address already exists, return
  const foundAccount = usersData.find((user) => user.email === email);
  if (foundAccount) {
    return res.status(400).send("An account with this email already exists.");
  }
  console.log("Information validated");
  return res.status(201).send("Information validated.");
});

module.exports = router;
