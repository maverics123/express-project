const bcrypt = require("bcrypt");
const Project = require("../model/Project");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const User = require("../model/User");
require("dotenv").config();
exports.addProject = async (req, res) => {
    try {
      const { title, description } = req.body;
      
      // Check if title and description are provided
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required fields.",
        });
      }
  
      // Create a new project
      const project = await Project.create({
        title,
        description,
      });
  
      return res.status(201).json({
        success: true,
        message: "Project created successfully.",
        project,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Failed to create project.",
        error: err.message,
      });
    }
  };

  


exports.assignProjectToUser = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    // Find project and user
    const project = await Project.findById(projectId);
    const user = await User.findById(userId);

    if (!project || !user) {
      return res.status(404).json({
        success: false,
        message: "Project or user not found.",
      });
    }

    // Update project model
    project.assignedUsers.push(userId);
    await project.save();

    // Update user model
    user.projects.push(projectId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Project assigned to user successfully.",
      project,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign project to user.",
      error: error.message,
    });
  }
};

exports.allProjects = async (req, res) => {
try{
    const projects = await Project.find();
    res.status(200).json(projects);
}

catch(error){
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all projects .",
      error: error.message,
    });
}
}

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
