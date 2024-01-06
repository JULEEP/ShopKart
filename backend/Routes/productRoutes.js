import express from 'express'
const router = express.Router();
import { createProduct,
     getAllProduct,
      getOneProduct,
       updateProduct,
        deleteProduct,
        productCnt,
        featuredProduct,
     } from '../Controller/productController.js';


router.post('/', createProduct)
router.get('/', getAllProduct)
router.get('/:id', getOneProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/get/count', productCnt)
router.get('/get/featured/:count', featuredProduct)

export default router