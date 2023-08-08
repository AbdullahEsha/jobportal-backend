const User = require('../models/User')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const bcrypt = require('bcryptjs')

module.exports.getUserData = async (req, res) => {
  try {
    const user = await User.find({}).populate({
      path: 'addressBook',
    })
    res.status(200).json({ status: 'success', total: user.length, data: user })
  } catch (err) {
    res.status(422).json({
      status: 'failed 🔴',
      message: err,
    })
  }
}
module.exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id).populate({
      path: 'addressBook',
    })
    if (user) {
      res.status(200).json({
        success: true,
        message: 'user found successfully',
        data: user,
      })
    }
  } catch (err) {
    res.status(422).json({
      status: 'failed 🔴',
      message: err,
    })
  }
}

module.exports.createUser = async (req, res) => {
  try {
    //get all data from req body
    const { fullName, email, password } = req.body

    //verify all the data exists or not
    if (!(fullName && email && password)) {
      return res.status(400).json({
        success: false,
        message: 'All fields is required',
      })
    }

    //check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: 'User already exists. please login',
      })
    }

    //encrypt the password
    const encPassword = await bcrypt.hash(password, 10)

    //save the user to db
    const user = await User.create({
      fullName,
      email,
      password: encPassword,
      gender: '',
      phone: '',
      refund: 0,
      imageUrl: req.body.imageUrl ? req.body.imageUrl : '',
      userType: 'user',
    })

    //generate a token for user and send it to user
    // const token = jwt.sign(
    //   { id: user._id, email: user.email, type: user.userType },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "20h" }
    // );

    // user.token = token;
    //By default token is null. insert token from jwt.sign. So it overwrite jwt token
    // user.password = undefined; //It not changing db password value to undefined. but it is used for not sending password to frontend.

    res.status(201).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('User not create for this error', error.message)
  }
}

module.exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!(email && password)) {
    return res.status(404).json({
      status: false,
      message: 'Please provide email and password',
    })
  }

  const user = await User.findOne({ email }).select('+password') //In User model schema password field is by default select false.

  if (!user) {
    return res.status(404).json({
      status: false,
      message: 'User not found with this email. Please provide valid email!🔴',
    })
  }
  const matchedPassword = await bcrypt.compare(password, user.password) // without await it's not work

  if (!matchedPassword) {
    return res.status(400).json({
      success: false,
      message: 'Password not matched. Try a different one',
    })
  }
  if (user.userType === 'admin' && matchedPassword) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '20h',
    })

    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 20 * 60 * 60 * 1000,
      ),
      httpOnly: true,
      sameSite: 'none',
      // secure: process.env.NODE_ENV === 'production',
      // secure: false,
    }

    res
      .status(200)
      .cookie('token', token, options)
      .json({
        success: true,
        message: 'Admin Logged In Successsfully',
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
          updatedAt: user.updatedAt,
          createdAt: user.createdAt,
        },
      })
  } else {
    res.status(400).json({
      success: false,
      message: 'Access Denied!🔴',
    })
  }
}

module.exports.isLoggedIn = async (req, res) => {
  const { token } = req.body

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied!🔴',
    })
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const user = await User.findOne(decoded._id)
  if (user.userType != 'admin') {
    res.status(401).json({
      success: false,
      message: 'Access Denied!🔴',
    })
  } else {
    res.status(200).json({
      status: 'success',
      user,
    })
  }
}
