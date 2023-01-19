const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const app = express();
const fs = require("fs");

// Middleware
app.use(express.json());

// // read the data file
// function readData(JsonFile) {
//   const file = fs.readFileSync(JsonFile);
//   const dataParse = JSON.parse(file);
//   return dataParse;
// }

router.get("/", (req, res) => {
  res.send("Server is running, no address sent!");
});

router.get("/:address", (req, res) => {
  console.log("Req.params: ", req.params);
  let { address } = req.params;

  axios
    .get(
      `${process.env.Geocoding_API}address=${address}&key=${process.env.Geocoding_API_key}`
    )
    .then((response) => {
      console.log(
        "Response lat from Maps: ",
        response.data.results[0].geometry.location.lat
      );
      const latitude = response.data.results[0].geometry.location.lat;
      const longitude = response.data.results[0].geometry.location.lng;
      return res.status(201).send({ latitude, longitude });
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(400)
        .send(
          "Your address couldn't be located. Please check your information and try again."
        );
    });

  //   if (!user_name) {
  //     console.log("No user name!");
  //     return res.status(400).send("Please enter your name");
  //   }

  //   console.log("Information validated");
  //   return res.status(201).send("Information validated.");
});

module.exports = router;
