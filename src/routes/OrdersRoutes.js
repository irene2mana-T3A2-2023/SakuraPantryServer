import express from 'express';
const OrdersRouter = express.Router();


//Retrieve all orders
OrdersRouter.get('/', (req, res) => {
    res.json({
        message: 'hello orders'
    });
});

//Create a new order
OrdersRouter.post('/', (req, res) => {

});

//Get specific order by ID
OrdersRouter.get('/:id', (req, res) => {

});

//Cancel specific order by ID
OrdersRouter.post('/cancel/:id', (req, res) => {

});

export default OrdersRouter;