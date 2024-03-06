const fs = require('fs')

class ProductsManager {
    constructor(path) {
        this.path = path
        this.productId = 1
    }

    async initializeProducts() {
        this.products = await this.getProducts()

        if(this.products.length > 0) {
            this.productId = Math.max(...this.products.map(prod => prod.id)) + 1
        }
    }

    async updateFile() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
    }

    async addProduct(title, description, price, thumbnail, code, stock) {

        if(this.products.some(prod => prod.code === code)) {
            throw new Error("'Code' field already exists for one or more products.")
        }

        if(!title || !description || isNaN(price) || price <= 0 || price === undefined || !price || !thumbnail || !code || isNaN(stock) || stock < 0 || stock === undefined || !stock) {
            throw new Error("One or more fields have invalid values.")
        }

        const product = {
            id: this.productId++,
            status: true,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(product)

        await this.updateFile()
    }

    async getProducts() {
        try {
            const productsContent = await fs.promises.readFile(this.path, 'utf-8', '\t')

            return JSON.parse(productsContent)
        }
        catch (err){
            return []
        }
    }

    async getProductsById(id) {
        const products = await this.getProducts()

        const product = products.find(prod => prod.id === id)

        if(!product) {
            throw new Error('Error retrieving product')
        } else {
            return product
        }
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts()

        const productIndex = await products.findIndex(prod => prod.id === id)

        if(productIndex !== -1) {
            this.products[productIndex] = {...products[productIndex], ...updates, id}

            await this.updateFile()
        } else {
            throw new Error('Error updating the product')
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts()

        const productIndex = await products.findIndex(prod => prod.id === id)

        if(productIndex !== -1) {
            this.products.splice(productIndex, 1)

            await this.updateFile()
        } else {
            throw new Error('Error deleting the product')
        }
    }
}

module.exports = ProductsManager