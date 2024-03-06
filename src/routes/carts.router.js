const { Router } = require('express')
const CartManager = require('../CartManager')

const router = Router()

const cartsManager = new CartManager(`${__dirname}/../../assets/Carts.json`)

router.post('/', async (_, res) => {
    try {
        await cartsManager.addCart()

        res.status(201).json({ status: 'Cart created', message: cartsManager.carts })
    }
    catch {
        res.status(400).json({ error: 'Error creating cart' })
    }
})

router.get('/:cartId', async (req, res) => {
    try {
        const cartId = +req.params.cartId

        const cart = await cartsManager.getCartsById(cartId)

        if(!cart) {
            res.json({ error: `Cart ${cartId} not found`})
            return
        } 

        res.json(cart.products)
        return
    }
    catch {
        res.status(400).json({ error: 'Error retrieving cart' })
    }
})

router.post('/:cartId/product/:productId', async (req, res) => {
    try {
        const cartId = +req.params.cartId

        const productId = +req.params.productId

        const cart = await cartsManager.getCartsById(cartId)

        await cartsManager.addToCart(cartId, productId)

        res.json(cart)
    }
    catch {
        res.status(400).json({ error: 'Error adding product to cart' })
    }
})

cartsManager.initializeCarts()

module.exports = router