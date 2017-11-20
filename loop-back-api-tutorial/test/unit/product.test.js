const { app, expect } = require('../common')

const Product = app.models.Product

describe('Custom methods', function(){
    it('should allow buying a product', function(){
       const product = new Product({ name : 'buy-product', price : 299})
       return product.buy(10,function(err,res){
           expect(res.status).to.contain('You bought 10 product(s)')
       })
    })

    it('should not allow buying a negative product quantity', function(){
        const product = new Product({ name : 'buy-product', price : 299})
        return product.buy(-10,function(err,res){
            expect(err).to.contain('Minmum quantity of 1 not fulfilled')
        })
     })
})

describe('Validation', function(){
    it('should reject a name < 3 chars', function(){
        return Product.create({ name:'a', price:299})
            .then(res => Promise.reject('Product should not be created'))
            .catch( err => {
                expect(err.message).to.contain('Name should be atleast 3 characters')
                expect(err.statusCode).to.be.equal(422)
            })
    })

    it('should reject a duplicate name', function(){
        return Promise.resolve()
            .then(() => Product.create({ name : 'abc', price : 299 }))
            .then(() => Product.create({ name : 'abc', price : 299 }))
            .then( res => Promise.reject('Product should not be created'))
            .catch( err => {
                expect(err.message).to.contain('Details: `name` is not unique')
                expect(err.statusCode).to.be.equal(422)
            })
    })

    it('should reject a price < 0', function(){
        return Product.create({ name:'lowPrice', price: -1})
            .then(res => Promise.reject('Product should not be created'))
            .catch( err => {
                expect(err.message).to.contain('Price should be a positive interger')
                expect(err.statusCode).to.be.equal(422)
            })
    })

})

describe('Hooks', function(){
    it('should not allow adding a product to non-existing category', function(){
        return Product.create({
            name:'new category',
            price : 199,
            categoryId: 999
        })
        .then( res => {
            expect(res).to.equal(null)
        })
        .catch( err => {
            expect(err).to.equal('Error adding product to non-existing category')
        })
    })
})