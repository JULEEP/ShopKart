import express from "express";
const router = express.Router();
import UserAuth from "../../Middleware/authMiddleware.js";
import {
    userRegistration,
    userLogin,
    updateUserPassword,
    loggeduser,
    otpSend,
}
    from "../../Controller/userController/userController.js";

router.use('/changepassword', UserAuth)
router.use('/loggeduser', UserAuth)

router.post('/register', userRegistration)
router.post('/otpsend', otpSend)
router.post('/login', userLogin)
router.post('/updatepassword', updateUserPassword)
router.get('/loggeduser', loggeduser)


export default router
