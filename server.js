const express = require("express");

const userRouter = require("./users/userRouter.js");

// function errorHandlingMiddleware(err, req, res, next) {
//     res.status(500).json(err.message);
// }

const server = express();
server.use(express.json());
server.use(logger);

server.use("/api/users", userRouter);

server.get("/", (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
    console.log(
        `${req.method} from http://localhost:4000${
            req.url
        } on ${new Date().toLocaleString()}`
    );
    next();
}

module.exports = server;
