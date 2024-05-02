const express=require("express");

const router=express.Router();

const {login,signup, profile, profileImageUpdate, forgotPassword,resetPassword,tokenValidity, getAllUsers, deleteUser, addAdmin} = require("../controller/Auth")
const {addProject, assignProjectToUser, allProjects,getUser} = require("../controller/Projectcontroller");

router.post("/login",login);
router.post("/signup",signup);
router.get("/profile",profile);
router.post("/imagepdate",profileImageUpdate)
router.post("/forgotpassword",forgotPassword)
router.put("/resetpassword/:id/:token",resetPassword)
router.get("/tokenvalidity",tokenValidity);
router.get("/getallusers",getAllUsers);
router.delete("/deleteuser",deleteUser)
router.put("/addadmin",addAdmin)
router.post("/addproject",addProject)
router.post("/assignproject",assignProjectToUser)
router.get("/allprojects",allProjects)
router.get('/users/:userId',getUser)

module.exports=router;