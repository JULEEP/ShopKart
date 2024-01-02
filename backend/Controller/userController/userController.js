import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import UserModel from '../../Model/User.js'
import jwt from 'jsonwebtoken';


const userRegistration = asyncHandler(async (req, res) => {

  const { firstName, lastName, email, password, password_confirmation, phone } = req.body
  const user = await UserModel.findOne({ email: email })
  if (user) {
    res.status(401).json({ message: "Email already exists" })
  } else {
    if (firstName && lastName && email && password && password_confirmation, phone) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10)
          const hashPassword = await bcrypt.hash(password, salt)
          const doc = new UserModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: hashPassword,
          })
          await doc.save()
          const saved_user = await UserModel.findOne({ email: email })
          // Generate JWT Token
          const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
          res.status(201).send({ message: "You registered successfully", "token": token })
        } catch (error) {
          console.log(error)
          res.status(404).json({ message: "You are unable to Register" })
        }
      } else {
        res.status(404).json({ message: "Password and Confirm Password doesn't match" })
      }
    } else {
      res.status(401)({ message: "All fields are required" })
    }
  }
});

//otpsend
const otpSend = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const user = await UserModel.findOne({ phone: phone });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user && user.isVerified)
    return res.status(400).json({ message: "User already verified" });

  return res.status(200).json({ message: "OTP Sent Successfully", data: user });
});


//userLogin

const userLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body
    if (email && password) {
      const user = await UserModel.findOne({ email: email })
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password)
        if ((user.email === email) && isMatch) {
          // Generate JWT Token
          const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
          res.status(200), json({ message: "Login Successfully", "token": token })
        } else {
          res.status(401).json({ message: "Email or Password is not Valid" })
        }
      } else {
        res.status(404)({ message: "User not found" })
      }
    } else {
      res.status(401).json({ message: "fullfill all sections" })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Unable to Login" })
  }
})

//changedPassword

const updateUserPassword = asyncHandler(async (req, res) => {
  const { password, password_confirmation } = req.body
  if (password && password_confirmation) {
    if (password !== password_confirmation) {
      res.status(401).json({ message: "New Password and Confirm New Password doesn't match" })
    } else {
      const salt = await bcrypt.genSalt(10)
      const newHashPassword = await bcrypt.hash(password, salt)
      await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
      res.status(200).json({ message: "Password changed succesfully" })
    }
  } else {
    res.status(401).json({ message: "All Fields are Required" })
  }
}
)

const loggeduser = asyncHandler(async (req, res) => {
  return res.send({ "user": req.user })
})

export { userRegistration, userLogin, updateUserPassword, loggeduser, otpSend }