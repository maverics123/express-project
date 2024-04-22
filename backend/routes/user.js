const express=require("express");

const router=express.Router();

const {login,signup, profile, profileImageUpdate} = require("../controller/Auth")

router.post("/login",login);
router.post("/signup",signup);
router.get("/profile",profile);
router.post("/imagepdate",profileImageUpdate)

module.exports=router;