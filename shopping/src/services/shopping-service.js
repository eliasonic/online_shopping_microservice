const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require('../utils/app-errors')

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async GetCart({ _id }) {
    try {
      const cartResult = await this.repository.Cart(_id)
      return FormateData(cartResult)
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageCart(customerId, product, qty, isRemove){
    try {
        const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);        
        return FormateData(cartResult);
    } catch (err) {
        throw new APIError('Data Not found', err)
    }
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrderPayload(userId, order, event) {
    
    if (order) {
      const payload = {
          event,
          data: { userId, order }
      }    
      return FormateData(payload)
    } else{
      return FormateData({ error: 'No Order is available' })
    }      

  }

  async SubscribeEvents(payload){
 
    const { event, data } =  payload;

    const { userId, product, qty } = data;

    switch(event){
      case 'ADD_TO_CART':
          this.ManageCart(userId,product, qty, false);
          break;
      case 'REMOVE_FROM_CART':
          this.ManageCart(userId,product,qty, true);
          break;
      default:
          break;
    }
  }

}

module.exports = ShoppingService;
