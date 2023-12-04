import express from 'express';
const ProductsRouter = express.Router();

//Get a list of products
ProductsRouter.get('/', (req, res) => {
    res.json({
        message: 'hello products'
    });
});

//Create a new product
ProductsRouter.post('/', (req, res) => {

});

//Get product detail by slug
ProductsRouter.get('/:slug', (req, res) => {

});

//Update product detail by slug  
ProductsRouter.put('/:slug', (req, res) => {

});

//Delete product detail by slug
ProductsRouter.delete('/:slug', (req, res) => {

});

export default ProductsRouter;