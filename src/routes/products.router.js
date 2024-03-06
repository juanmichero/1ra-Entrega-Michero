const { Router } = require('express')
const ProductManager = require('../ProductManager')

const router = Router()

const productsManager = new ProductManager(`${__dirname}/../../assets/Products.json`)

router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts()
        const limit = req.query.limit

        const limitedProducts = limit
            ? products.slice(0, limit)
            : products
        
        res.json(limitedProducts)
        return
    } 
    catch (err) {
        res.status(400).json({ error: 'Error retrieving products' })
    }
})

router.get('/:productId', async (req, res) => {
    try {
        const productId = +req.params.productId

        const product = await productsManager.getProductsById(productId)

        if(!product) {
            res.json({ error: `Product ${productId} not found`})
            return
        }

        res.json(product)
        return
    }
    catch (err) {
        res.status(400).json({ error: 'Error retrieving product' })
    }
})

router.post('/', async (req, res) => {
    try {
        await productsManager.addProduct(req.body.title, req.body.description, req.body.price, req.body.thumbnail, req.body.code, req.body.stock)

        res.status(201).json({ status: 'Product created', message: req.body })
    }
    catch (err) {
        res.status(400).json({ error: 'Error creating product' })
    }
})

router.put('/:productId', async (req, res) => {
    try {

        const products = await productsManager.getProducts()

        const productId = +req.params.productId

        const updates = req.body

        const productIndex = products.findIndex(prod => prod.id === productId)

        if(productIndex < 0) {
            res.json({ error: `Product ${productId} not found`})
            return
        }

        await productsManager.updateProduct(productId, updates)

        res.status(201).json({ status: 'Product updated', message: products[productIndex] })
    }
    catch (err) {
        res.status(400).json({ error: 'Error updating product' })
    }
})

router.delete('/:productId', async (req, res) => {
    try {

        const products = await productsManager.getProducts()

        const productId = +req.params.productId

        const productIndex = products.findIndex(prod => prod.id === productId)

        if(productIndex < 0) {
            res.json({ error: `Product ${productId} not found`})
            return
        }

        await productsManager.deleteProduct(productId)

        res.status(201).json({ status: 'Product deleted', message: products[productIndex] })
    }
    catch (err) {
        res.status(400).json({ error: 'Error deleting product' })
    }
})

productsManager.initializeProducts()

module.exports = router