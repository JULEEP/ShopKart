import express from 'express'
import OrderModel from '../Model/Order.js'
import OrderItem from '../Model/order-item.js'
import asyncHandler from 'express-async-handler'

const createOrder = asyncHandler(async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new OrderModel({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if (!order)
        return res.status(400).json({message: 'the order cannot be created!'})

    res.send(order);
});


const getOrders = asyncHandler(async (req, res) => {
    const orderList = await OrderModel.find().populate('user', 'name').sort({ 'dateOrdered': -1 });

    if (!orderList) {
        res.status(500).json({ message: 'Order not found' })
    }
    res.send(orderList);
})

const getOneOrder = asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        });

    if (!order) {
        return res.status(500).json({ message: 'Orders not fount!' })
    }
    return res.send(order);
})

const updateOrder = asyncHandler(async (req, res) => {
    const order = await OrderModel.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    )

    if (!order)
        return res.status(400).json({message: 'the order cannot be update!'})

    res.send(order);
})

const deleteOrder = asyncHandler(async (req, res) => {
    Order.findByIdAndDelete(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndDelete(orderItem)
            })
            return res.status(200).json({ success: true, message: 'the order is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "order not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

const getTotalSales = asyncHandler(async (req, res) => {
    const totalSales = await OrderModel.aggregate([
        { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
    ])

    if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({ totalsales: totalSales.pop().totalsales })
})

const getOrderCount = asyncHandler(async (req, res) => {
    const orderCount = await OrderModel.countDocuments((count) => count)

    if (!orderCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        orderCount: orderCount
    });
})

const getUserOrder = asyncHandler(async (req, res) => {
    const userOrderList = await OrderModel.find({ user: req.params.userid }).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    }).sort({ 'dateOrdered': -1 });

    if (!userOrderList) {
        res.status(500).json({ success: false })
    }
    res.send(userOrderList);
})



export {
    createOrder,
    getOrders,
    getOneOrder,
    updateOrder,
    deleteOrder,
    getOrderCount,
    getTotalSales,
    getUserOrder
}