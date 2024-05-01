const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

require("dotenv").config();
exports.signup = async (req, res) => {
    let config = {
        service: 'gmail', 
        auth: {
            user: process.env.NODEJS_GMAIL_APP_USER,   
            pass: process.env.NODEJS_GMAIL_APP_PASSWORD 
        }
    }
    let transporter = nodemailer.createTransport(config);

    try {
        const { fname, lname, email, password, gender, profileUrl} = req.body;
        let message = {
            from: 'anmolsite001@gmail.com', 
            to: req.body.email, 
            subject: 'Welcome to ABC Website!',
            html: `<b>Hello ${fname} ${lname}, thanks for joining with us</b>`
        };

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const role="User";
        const isSuperAdmin=false;
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
            fname, lname, email, password: hashedPassword, gender, profileUrl, role,isSuperAdmin
        });
         console.log("after creating in db",user);  
          if(user){
            transporter.sendMail(message).then((info) => {
                return res.status(201).json(
                    {
                        msg: "Email sent",
                        info: info.messageId,
                        preview: nodemailer.getTestMessageUrl(info)
                    }
                )
            }).catch((err) => {
                return res.status(500).json({ msg: err });
            }
            );
          }

        // res.status(201).json({
        //     success: true,
        //     message: "User created successfully"
        // });
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
             role:user.role,

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
                   role:user.role,
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
  

  exports.forgotPassword = async (req, res)=>{
    try{
        let config = {
            service: 'gmail', 
            auth: {
                user: process.env.NODEJS_GMAIL_APP_USER,   
                pass: process.env.NODEJS_GMAIL_APP_PASSWORD 
            }
        }
        let transporter = nodemailer.createTransport(config);
       
   const {email} = req.body;
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

    let token = jwt.sign(payload,process.env.JWT_SECRET,
       {
           expiresIn:"2h",    
       });
       const userObject = user.toObject(); // Convert to plain JS object
       userObject.token=token;
       userObject.password=undefined;
      
       let message = {
        from: 'anmolsite001@gmail.com', 
        to: req.body.email, 
        subject: 'link to reset password',
        html: `<b>Hello your password rest link is</b> http://localhost:3000/resetpassword/${user._id}/${token}`
    };
        
    
        transporter.sendMail(message).then((info) => {
            return res.status(201).json(
                {
                    success:true,
                    token,
                      message:"Email has been sent on your mail",
                    
                    info: info.messageId,
                    preview: nodemailer.getTestMessageUrl(info)
                }
            )
        }).catch((err) => {
            return res.status(500).json({ msg: err });
        }
        );
      
       


    }
       catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
  

};

exports.resetPassword = async (req, res) => {
    try {
       const { id, token } = req.params;
       const { password } = req.body;
      
       jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
          if (err) {
             return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
             });
          } else {
             try {
                const hashedPassword = await bcrypt.hash(password, 10);
                console.log("hashed string is :",hashedPassword);
                await User.findByIdAndUpdate(id, { password: hashedPassword });
                return res.status(200).json({
                   success: true,
                   message: "Password reset successfully",
                });
             } catch (err) {
                console.error(err);
                return res.status(500).json({
                   success: false,
                   message: "Error resetting password",
                });
             }
          }
       });
    } catch (error) {
       console.error(error);
       return res.status(500).json({
          success: false,
          message: "Internal server error",
       });
    }
 };

 exports.tokenValidity = async (req, res) => {
    try{
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
             success:false,
            error: 'Token is required',
            message:"please login first", });
    }

    const token = authorizationHeader.split(' ')[1];
console.log(token);
if (!token) {
    return res.status(401).json({ 
        success:false,
        error: 'Token is required',
        message:"please login first",
    });
  }


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
    res.status(401).json({ error: 'Invalid token',
    success:false,

});
  }       
             
           
           
 }


 exports.getAllUsers = async (req, res) => {
     try {
         const users = await User.find();
         res.status(200).json(users);
     } catch (error) {
         res.status(500).json({ error: 'Internal Server Error' });
     }
 };
 
 exports.deleteUser = async (req, res) => {
    const { id } = req.body; // Assuming the ID is sent in the request body
    try {
        const user = await User.findByIdAndDelete(id); // Corrected method name to findByIdAndDelete
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // If user with the provided ID is not found
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addAdmin = async (req, res) => {
    const { id } = req.body; // Assuming the ID is sent in the request body
    try {
        const user = await User.findByIdAndUpdate(id, { role: 'Admin' });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } 
        res.status(200).json({ message: 'User role updated to admin successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


 