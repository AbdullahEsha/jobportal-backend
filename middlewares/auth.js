const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('../models/User')

module.exports.verify = async (req, res, next) => {
  try {
    let token
    if (req.cookies.jwt) token = req.cookies.jwt
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // eslint-disable-next-line prefer-destructuring
      token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
      return 'Access Denied ⁣⁣🔴'
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded._id)
    if (!user) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401,
        ),
      )
    }
    req.user = user
    return next()
  } catch (err) {
    res.status(422).json({
      status: 'Access Denied 🔴',
      message: err,
    })
  }
}

module.exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
    if (user === null) {
      return res.status(202).json({ status: 'Not matched' })
    }
    res.status(200).json({ status: 'Found!', user })
  } catch (err) {
    res.status(422).json({
      status: 'failed 🔴',
      message: err,
    })
  }
}

// module.exports.verifyAdmin = async (req, res, next) =>{
//   // console.log('cookies data',process.env.JWT_SECRET,req.cookies);

//   //grab token from cookies
//   const {token} = req.cookies;

//   //check if no token
//   if (!token) {
//     res.status(403).send("please login first")
//   }

//   try {
//     //decode the token and get id
//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('decodeed code',process.env.JWT_SECRET,decode);
//     req.user = decode;
//   } catch (error) {
//     console.log(error);
//     res.status(401).send("invalid token")
//   }

//   return next();
// }

module.exports.verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res
        .status(401)
        .json({ status: 'Access Denied 🔴', message: 'Missing token' })
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res
      .status(401)
      .json({ status: 'Access Denied 🔴', message: 'Invalid token' })
  }
}
