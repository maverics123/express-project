const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;

require("dotenv").config();
exports.signup = async (req, res) => {
    try {
        const { fname, lname, email, password, gender, profileUrl} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) { // Change error to err
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error hashing password",
            });
        }

        const user = await User.create({
            fname, lname, email, password: hashedPassword, gender, profileUrl
        });

        res.status(201).json({
            success: true,
            message: "User created successfully"
        });
    } catch (err) { // Change error to err
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User could not register",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"feild are empty",
            });
        }
        const user = await User.findOne({email});
        
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user does not exist",
            });
        }
          const payload={
             email:user.email,
             id:user._id,

          }
        if(await bcrypt.compare(password,user.password)){
             let token = jwt.sign(payload,process.env.JWT_SECRET,
                {
                    expiresIn:"2h",    
                });
                const userObject = user.toObject(); // Convert to plain JS object
                userObject.token=token;
                userObject.password=undefined;
                //  const options={
                //     expires:new Date(Date.now()+3*24*60*60*1000),
                //     httpOnly:true,
                //  }
                // res.cookie("token",token,options).status(200).json({
                //     success:true,
                //     token,
                //     user:userObject,
                //     message:"user logged in successfully",

                // });
                    
                res.status(200).json({
                    success:true,
                   token,
                     user:userObject,
                     message:"user logged in successfully",
                })

        }
        else{
            return res.status(403).json({
                success:false,
                message:"password does not match",
            });
        }
      
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

exports.profile = async (req, res) => {

const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token is required' });
    }

    const token = authorizationHeader.split(' ')[1];
console.log(token);
if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 console.log(decoded);
    // Extract user ID from the decoded token
    const userId = decoded.id;
    console.log(userId);
    const userProfile = await User.findById(userId).exec();
    if (!userProfile) {
        return res.status(404).json({ error: 'User profile not found' });
    }

    // User profile found, send it back to client
    res.json({ userProfile });
  }
  catch(error){
    console.error('Error decoding token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }

};




// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.profileImageUpdate = async (req, res) => {
    try {
      // Assuming you're using a form with enctype="multipart/form-data" to upload files
      const file = req.files.file; // Extract the file from req.files
    
      const authorizationHeader = req.headers['authorization'];

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Token is required' });
      }
  
      const tokenn = authorizationHeader.split(' ')[1];
  console.log(tokenn);
  if (!tokenn) {
      return res.status(401).json({ error: 'Token is required' });
    }


      const decoded = jwt.verify(tokenn, process.env.JWT_SECRET);
      const userId = decoded.id; // Extract user ID from the decoded token
  
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const folder = 'formdata'; // Specify your folder name on Cloudinary
  
      // Upload image to Cloudinary with folder specified
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder,
        fetch_format: 'auto' // Pass fetch_format with value 'auto'
      });
  
      // Update user profile with the new image URL
      const user = await User.findByIdAndUpdate(userId, { profileUrl: result.secure_url }, { new: true });
  
      res.status(200).json({ success: true, message: 'Profile image updated successfully', user });
    } catch (err) {
      console.error('Error updating profile image:', err);
      res.status(500).json({ success: false, message: 'Failed to update profile image' });
    }
  };
  