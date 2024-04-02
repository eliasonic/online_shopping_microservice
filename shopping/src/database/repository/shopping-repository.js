const { CartModel, OrderModel } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-errors')


//Dealing with data base operations
class ShoppingRepository {

    // payment

    async Orders(customerId){
        try{
            const orders = await OrderModel.find({customerId })     
            return orders;
        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders')
        }
    }

    async Cart(customerId){
        try {
            const cart = await CartModel.find({ customerId })

            if (cart) {
                return cart
            }

            throw new Error('Data not found')
        } catch (err) {
            throw err
        }
    }
 
    async AddCartItem(customerId, product, qty, isRemove) {
        try {
            const cart = await CartModel.findOne({ customerId });
    
            if (cart) {
                const cartItem = { product: {...product}, unit: qty };
        
                let cartItems = cart.items;

                let isExist = false;
        
                if (cartItems.length > 0) {
                    cartItems.map((item) => {
                        if (item.product._id.toString() === product._id.toString()) {
                            if (isRemove) {
                                cartItems.splice(cartItems.indexOf(item), 1);
                            } else {
                                item.unit = qty;
                            }
                            isExist = true;
                        }
                    });
                }
        
                if (!isExist && !isRemove) {
                    cartItems.push(cartItem);
                }
        
                cart.items = cartItems;
        
                return await cart.save();
        
            } else{
                return await CartModel.create({
                    customerId,
                    items: [cartItem]
                })
            }
        
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Customer"
            );
        }
    }
 
    async CreateNewOrder(customerId, txnId){

        //check transaction for payment Status
        
        try{
            const cart = await CartModel.findOne({ customerId });
    
            if(cart){
                
                let amount = 0;   
     
                let cartItems = cart.items;
    
                if(cartItems.length > 0){
                    //process Order
                    cartItems.map(item => {
                        amount += parseInt(item.product.price) *  parseInt(item.unit);   
                    });
        
                    const orderId = uuidv4();
        
                    const order = new OrderModel({
                        orderId,
                        customerId,
                        amount,
                        txnId,
                        status: 'received',
                        items: cartItems
                    })
        
                    cart.items = [];
                    
                    const orderResult = await order.save();
    
                    await cart.save();
    
                    return orderResult;
                }
            }
    
          return {}

        }catch(err){
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category')
        }
        

    }
}

module.exports = ShoppingRepository;