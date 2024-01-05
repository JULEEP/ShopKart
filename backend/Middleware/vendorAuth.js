import jwt from "jsonwebtoken"
import VendorModel from "../Model/Vendor.js"


//vendorauth
var VendorAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { vendorID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

      // Get Vendor from Token
      req.vendor = await VendorModel.findById(vendorID).select('-password')

      next();
    } catch (error) {
      console.log(error)
      return res.status(401).json({ message: "Unauthorized Vendorr" })
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized Vendor, No Token" })
  }
}

export default VendorAuth