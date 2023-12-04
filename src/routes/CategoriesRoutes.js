import express from 'express';
const CategoriesRouter = express.Router();

//Get a list of categories 
CategoriesRouter.get('/', (req, res) => {
    res.json({
        message: 'hello categories'
    });
});

//Create a new category
CategoriesRouter.post('/', (req, res) => {

});

//Update category by slug
CategoriesRouter.put('/:slug', (req, res) => {

});

//Delete category by slug
CategoriesRouter.delete('/:slug', (req, res) => {

});

export default CategoriesRouter;