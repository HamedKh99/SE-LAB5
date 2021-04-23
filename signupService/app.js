const express = require("express");
require("./src/db/mongoose");
const User = require("./src/models/user");

const port = process.env.SIGNUP_PORT || 8081;

const app = express();

app.use(express.json());

app.post("/user/signup", async (req, res) => {
  delete req.body.is_admin;
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
