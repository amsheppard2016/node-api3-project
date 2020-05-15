const express = require("express");

const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

router.use((req, res, next) => {
    console.log("user router!");
    next();
});

router.post("/", validateUser, (req, res) => {
    // do your magic!
    const body = req.body;
    Users.insert(body)
        .then(res.status(201).json({ message: "user posted" }))
        .catch((err) => {
            res.status(500).json({ message: "database error", err });
        });
});

router.post("/:id/posts", validateUserId, (req, res) => {
    // do your magic!
    const { id: user_id } = req.params;
    const { text } = req.body;
    Posts.insert({ user_id, text })
        .then((added) => {
            console.log(added);
            res.status(201).json({ added });
        })
        .catch((err) => {
            res.status(500).json({ message: "database error", err });
        });
});

router.get("/", (req, res, next) => {
    // do your magic!
    Users.get(req.query)
        .then((user) => {
            if (user.length > 0) {
                res.status(200).json(user);
            } else {
                res.status(500).json({
                    message: "unable to retrieve user database ",
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message: "Error retrieving the users",
            });
        });
});

router.get("/:id", validateUserId, (req, res) => {
    const user = req.body.user;
    console.log(user);
    if (user) {
        res.status(200).json(req.body.user);
    } else {
        res.status(500).json({
            message: "unable to retrieve user from database ",
        });
    }
});

router.get("/:id/posts", validateUserId, (req, res) => {
    // do your magic!
    const { id } = req.params;
    console.log(id);
    Users.getUserPosts(id)
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((err) => {
            res.status(500).json({
                message: "unable to retrieve user from database ",
                err,
            });
        });
});

router.delete("/:id", validateUserId, (req, res) => {
    // do your magic!
    Users.remove(req.body.user.id).then((user) => {
        if (user) {
            res.status(200).json({ message: "user removed" });
        } else {
            res.status(500).json({ message: "unable to remove user" });
        }
    });
});

router.put("/:id", validateUserId, (req, res) => {
    // do your magic!
    const { id } = req.params;
    const { name } = req.body;
    Users.update(id, { name })
        .then((user) => {
            if (user) {
                Users.getById(id).then((user) => {
                    res.status(200).json({ message: "user updated" });
                });
            } else {
                res.status(400).json({ message: "unable to update user" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "database error", err });
        });
});

//custom middleware

function validateUserId(req, res, next) {
    // do your magic!
    const { id } = req.params;
    Users.getById(id)
        .then((user) => {
            if (user) {
                req.body.user = user;
                next();
            } else {
                res.status(400).json({ message: "invalid user id" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "validate id err", err });
        });
}

function validateUser(req, res, next) {
    // do your magic!
    const { name } = req.body;
    console.log(name);
    if (!name) {
        res.status(400).json({ message: "missing user data" });
    } else if (name === "") {
        res.status(400).json({ message: "missing required name field" });
    } else {
        next();
    }
}

function validatePost(req, res, next) {
    // do your magic!
    const { text } = req.body;
    if (!text) {
        res.status(400).json({ message: "missing post data" });
    } else if (text === undefined) {
        res.status(400).json({
            message: "missing required text field",
        });
    } else {
        next();
    }
}

module.exports = router;
