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
        catch (err){
            return []
        }
    }

    async getCartsById(id) {
        const carts = await this.getCarts()

        const cart = carts.find(cart => cart.id === id)

        if(!cart) {
            throw new Error('Error retrieving cart')
        } else {
            return cart
        }
    }

    async addToCart(cartId, productId) {
        const carts = await this.getCarts()

        const cartIndex = await carts.findIndex(cart => cart.id === cartId)

        if(cartIndex !== -1) {
            this.carts[cartIndex].products.push({ 'product': productId, 'quantity': 1 })

            await this.updateFile()
        } else {
            throw new Error('Error adding product to cart')
        }
    }
}

module.exports = CartManager