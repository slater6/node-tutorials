'use strict';

module.exports = function(Product){

    Product.observe('before save', function (ctx,next){
        if(ctx.instance && ctx.instance.categoryId){
            return Product.app.models.Category
            .count({ id: ctx.instance.categoryId})
            .then( res => {
                if( res < 1){
                    return Promise.reject('Error adding product to non-existing category')
                }
            })
        }

        return next()
    })

  const validQuantity = quantity => Boolean(quantity > 0);
    /**
    * Buy this product
    * @param {number} quantity Number of product to buy
    * @param {Function(Error, object)} callback
    */

    Product.prototype.buy = function(quantity, callback) {

    if (!validQuantity(quantity)) {
        return callback('Minmum quantity of 1 not fulfilled')
    }

    const results = {
        status: `You bought ${quantity} product(s)`,
    };
    // TODO
    callback(null, results);
    };

    Product.validatesLengthOf('name', {
        min: 3,
        message: {
            min: 'Name should be atleast 3 characters',
        }
    });

    Product.validatesUniquenessOf('name');

    const positiveInterger = /^[0-9]*$/;

    const validatePositiveInterger = function(err){
        if(!positiveInterger.test(this.price)){
            err()
        }
    }

    Product.validate('price', validatePositiveInterger, {
        message: 'Price should be a positive interger'
    });
};
