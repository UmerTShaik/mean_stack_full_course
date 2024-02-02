const express = require("express");

const PostController = require("../controllers/posts")
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");


//use middlweare to chek token using checkAuth
router.post( "", checkAuth, extractFile,PostController.createPost
);
//use middlweare to chek token using checkAuth
//make sure only user created the post can edit it
router.put("/:id", checkAuth , extractFile,PostController.updatePost
);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

//use middlweare to chek token using checkAuth
router.delete("/:id", checkAuth,PostController.deletePost );

module.exports = router;
