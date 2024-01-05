import express from 'express'
import OrderModel from '../Model/Order.js'
import ProductModel from '../Model/Product.js'
import CategoryModel from '../Model/Category.js'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'

const createProduct = asyncHandler(async (req, res) => {
    const category = await CategoryModel.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    let product = new ProductModel({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,// "http://localhost:3000/public/upload/image-2323232"
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();

    if (!product)
        return res.status(500).send('The product cannot be created')

    res.send(product);
})

const getAllProduct = asyncHandler(async (req, res) => {
    const products = await ProductModel.find();
    if (!products) {
        return res.status(500).json({ message: 'Products not found' })
    }
    return res.status(200).json({ message: 'Product data sent', data: products })
})
//get a product
const getOneProduct = asyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product);
})


const updateProduct = asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }
    const category = await CategoryModel.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    const product = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )

    if (!product)
        return res.status(500).send('the product cannot be updated!')

    res.send(product);
})


const deleteProduct = asyncHandler(async (req, res) => {
    ProductModel.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'the product is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "product not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

const productCnt = asyncHandler(async (req, res) => {
    try {
        const count = await ProductModel.countDocuments();
        return res.status(200).json({ message: 'count is here', count })
    } catch (err) {
        return res.status(403).json({ message: 'Data not found' })

    }
})

const featuredProduct = asyncHandler(async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await ProductModel.find({ isFeatured: true }).limit(+count);

    if (!products) {
        res.status(500).json({ success: false })
    }
    res.send(products);
})

export {
    createProduct,
    getAllProduct,
    getOneProduct,
    updateProduct,
    deleteProduct,
    productCnt,
    featuredProduct
}