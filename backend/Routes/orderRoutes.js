import express from 'express'
const router = express.Router();
import {
    createOrder,
    getOrders,
    getOneOrder,
    updateOrder,
    deleteOrder,
    getOrderCount,
    getTotalSales,
    getUserOrder
} from '../Controller/orderController.js';
import VendorAuth  from '../Middleware/vendorAuth.js'



router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:id', getOneOrder)
router.get('/get/totalsales', getTotalSales)
router.get('/get/count', getOrderCount)
router.get('/get/userorders/:userid', getUserOrder)
router.put('/:id', VendorAuth, updateOrder)
router.delete('/', VendorAuth, deleteOrder)


export default router