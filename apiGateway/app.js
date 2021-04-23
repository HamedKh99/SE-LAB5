const express = require("express");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
require("./src/db/mongoose");
const User = require("./src/models/user");

const port = process.env.PORT || 8080;

const constructServiceURL = (ip = "localhost", port, path) => {
  return "http://" + ip + ":" + port + path;
};

const app = express();

app.use(express.json());

// API Gateway
app.use(async (req, res, next) => {
  //signup service no auth
  if (req.path === "/user/signup" && req.method === "POST") {
    const response = await fetch(
      constructServiceURL(
        process.env.SIGNUP_IP,
        process.env.SIGNUP_PORT || 8081,
        req.path
      ),
      {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" },
      }
    );
    const resJson = await response.json();
    res.send(resJson);
  }
  // login service no auth
  else if (req.path === "/user/login" && req.method === "POST") {
    const response = await fetch(
      constructServiceURL(
        process.env.LOGIN_IP,
        process.env.LOGIN_PORT || 8082,
        req.path
      ),
      {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" },
      }
    );
    const resJson = await response.json();
    res.send(resJson);
  }
  //auth required
  else {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
      if (!user) throw new Error();

      //profile service
      if (
        req.path === "/user/profile" &&
        (req.method === "GET" || req.method === "PUT")
      ) {
        const requestOptions = {
          method: req.method,
          body: JSON.stringify(req.body),
          headers: {
            "Content-Type": "application/json",
            Authorization: req.header("Authorization"),
          },
        };
        if (req.method === "GET") delete requestOptions.body;
        const response = await fetch(
          constructServiceURL(
            process.env.PROFILE_IP,
            process.env.PROFILE_PORT || 8083,
            req.path
          ),
          requestOptions
        );
        const resJson = await response.json();
        res.send(resJson);
      }
      // book crud service
      else if (req.path.startsWith("/book")) {
        if (!user.is_admin) throw new Error();
        const requestOptions = {
          method: req.method,
          body: JSON.stringify(req.body),
          headers: {
            "Content-Type": "application/json",
            Authorization: req.header("Authorization"),
          },
        };
        if (req.method === "GET") delete requestOptions.body;
        const response = await fetch(
          constructServiceURL(
            process.env.BOOK_IP,
            process.env.BOOK_PORT || 8084,
            req.path
          ),
          requestOptions
        );
        const resJson = await response.json();
        res.send(resJson);
      }
      // see books by client
      else if (req.path.startsWith("/client/book") && req.method === "GET") {
        if (user.is_admin) throw new Error();
        const response = await fetch(
          constructServiceURL(
            process.env.SEEBOOKS_IP,
            process.env.SEEBOOKS_PORT || 8085,
            req.path
          )
        );
        const resJson = await response.json();
        res.send(resJson);
      } else {
        res.status(404).send();
      }
    } catch (e) {
      res.status(401).send({ error: "Please Authenticate" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
