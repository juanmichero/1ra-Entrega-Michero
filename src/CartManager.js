const fs = require('fs')

class CartManager {
    constructor(path) {
        this.path = path
        this.cartId = 1
    }

    async initializeCarts() {
        this.carts = await this.getCarts()

        if(this.carts.length > 0) {
            this.cartId = Math.max(...this.carts.map(cart => cart.id)) + 1
        }
    }

    async updateFile() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, '\t'))
    }

    async addCart() {
        const cart = {
            id: this.cartId++,
            products: []
        }

        this.carts.push(cart)

        await this.updateFile()
    }

    async getCarts() {
        try {
            const cartsContent = await fs.promises.readFile(this.path, 'utf-8', '\t')

            return JSON.parse(cartsContent)
        }
        catch {
            return []
        }
    }

    async getCartsById(id) {
        const carts = await this.getCarts()

        const cart = carts.find(cart => cart.id === id)

        if(!cart) {
            console.error(`Cart ${id} not found`)
            return
        } else {
            return cart
        }
    }

    async getProducts() {
        try {
            const productsContent = await fs.promises.readFile(`${__dirname}/../assets/Products.json`)

            return JSON.parse(productsContent)
        } 
        catch {
            throw new Error('Error retrieving products from Products.json')
        }
    }

    async addToCart(cartId, productId) {
        const carts = await this.getCarts()

        const cartIndex = await carts.findIndex(cart => cart.id === cartId)

        const products = await this.getProducts()

        const existingProductInProducts = products.find(prod => prod.id === productId)

        if(existingProductInProducts) {
            if(cartIndex !== -1) {
                const existingProduct = this.carts[cartIndex].products.find(prod => prod.product === productId)
    
                if(existingProduct) {
                    existingProduct.quantity += 1
                } else {
                    this.carts[cartIndex].products.push({ 'product': productId, 'quantity': 1 })
                }
                
                await this.updateFile()
            } else {
                throw new Error(console.error(`Error adding product ${productId} to cart ${cartId}`))
            }
        } else {
            throw new Error(console.error(`Error adding product ${productId} to cart ${cartId}`))
        }
    }
}

module.exports = CartManager