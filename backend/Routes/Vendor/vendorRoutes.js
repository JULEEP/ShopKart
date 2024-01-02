import express from "express";
const router = express.Router();
import VendorAuth from "../../Middleware/vendorAuth.js";

import {
    vendorRegistration,
    vendorLogin,
    otpSend,
    updateVendorPassword,
    loggedvendor,
} from "../../Controller/VendorController/vendorController.js";



//apis

router.use('/changepassword', VendorAuth)
router.use('/loggedvendor', VendorAuth)


router.post('/register', vendorRegistration);
router.post('/login', vendorLogin);
router.post('/otpsend', otpSend);
router.post('/update/vendorpassword', updateVendorPassword);
router.get('/loggedvendor', loggedvendor);

export default router