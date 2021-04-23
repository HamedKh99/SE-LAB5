const express = require("express");
require("./src/db/mongoose");
const User = require("./src/models/user");

const port = process.env.LOGIN_PORT || 8082;

const app = express();

app.use(express.json());

app.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
