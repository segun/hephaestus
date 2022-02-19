const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
require('dotenv').config();
var cors = require("cors");
const { p5, sketch, getCanvas, pullRequest } = require("./p5");
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/image/:path", (req, res) => {
  const filename = req.params.path;
  res.sendFile(path.join(__dirname, filename));
});

app.post("/", (req, res) => {
  pullRequest.pr = req.body;
  let p5Instance = p5.createSketch(sketch);
  console.log(req.body);
  const data = req.body;
  const user = data.user.login;
  const id = data.id;
  const prNumber = data.number;
  const nodeId = data.node_id;

  const filename = crypto
    .createHash("md5")
    .update(`${user}_${id}_${prNumber}_${nodeId}`)
    .digest("hex");

  const instance = p5.createSketch(sketch);
  console.log("Saving Sketch");
  instance.saveCanvas(getCanvas(), filename, "png").then((filename) => {
    console.log(filename);
    try {
      const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      res.send(`${fullUrl}image/${filename}`);
    } catch (err) {
      res.send(err);
    }
  });
});

app.listen(port, () => {
  console.log("Hephaestus Started on PORT: ", port);
});
