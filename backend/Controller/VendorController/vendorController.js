import asyncHandler from 'express-async-handler';
import VendorModel from '../../Model/Vendor.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';


const vendorRegistration = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, password_confirmation, phone } = req.body
    const vendor = await VendorModel.findOne({ email: email })
    if (vendor) {
        res.status(401).json({ message: "Email already exists" })
    } else {
        if (firstName && lastName && email && password && password_confirmation, phone) {
            if (password === password_confirmation) {
                try {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    const doc = new VendorModel({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: phone,
                        password: hashPassword,
                    })
                    await doc.save()
                    const saved_vendor = await VendorModel.findOne({ email: email })
                    // Generate JWT Token
                    const token = jwt.sign({ vendorID: saved_vendor._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
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

    const vendor = await VendorModel.findOne({ phone: phone });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (vendor && vendor.isVerified)
        return res.status(400).json({ message: "Vendor already verified" });

    return res.status(200).json({ message: "OTP Sent Successfully", data: vendor });
});


//vendorLogin

const vendorLogin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        if (email && password) {
            const vendor = await UserModel.findOne({ email: email })
            if (vendor != null) {
                const isMatch = await bcrypt.compare(password, vendor.password)
                if ((vendor.email === email) && isMatch) {
                    // Generate JWT Token
                    const token = jwt.sign({ vendorID: vendor._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
                    res.status(200), json({ message: "Login Successfully", "token": token })
                } else {
                    res.status(401).json({ message: "Email or Password is not Valid" })
                }
            } else {
                res.status(404)({ message: "Vendor not found" })
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

const updateVendorPassword = asyncHandler(async (req, res) => {
    const { password, password_confirmation } = req.body
    if (password && password_confirmation) {
        if (password !== password_confirmation) {
            res.status(401).json({ message: "New Password and Confirm New Password doesn't match" })
        } else {
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            await VendorModel.findByIdAndUpdate(req.vendor._id, { $set: { password: newHashPassword } })
            res.status(200).json({ message: "Password changed succesfully" })
        }
    } else {
        res.status(401).json({ message: "All Fields are Required" })
    }
}
)

const loggedvendor = asyncHandler(async (req, res) => {
    return res.send({ "vendor": req.vendor })
})

//onboarding vendor
const onboardingVendor = asyncHandler(async (req, res) => {
    const { firstName, lastName, password, companyName, email } = req.body;


    if (firstName && lastName && password && companyName && email) {
        return res.status(400).json({ message: 'Vendor is already Orboarded.' });
    }

    // Create a new vendor
    const newVendor = {
        vendorName,
        password,
        companyName,
        email,
    };

    // Add the vendor to the in-memory storage
    newVendor.save();

    // You may want to hash the password and store it securely in production

    res.json({ message: 'Vendor Onboarded successfully.' });
});


export { vendorRegistration, otpSend, vendorLogin, updateVendorPassword, loggedvendor, onboardingVendor }