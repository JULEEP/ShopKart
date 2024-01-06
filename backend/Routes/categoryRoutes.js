import express from 'express'
const router = express.Router();
import {
    createCat,
    getAllCat,
    getOne,
    updateCategory,
    deleteOneCategory
} from '../Controller/categoriesController.js';


//routes      
router.post('/', createCat);
router.get('/', getAllCat)
router.get('/:id', getOne)
router.put('/:id', updateCategory)
router.delete('/:id', deleteOneCategory)



export default router;