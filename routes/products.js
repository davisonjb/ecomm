const express = require('express');
const router = express.Router();
const productsRepo = require('../repositories/products.js');
const productsIndexTemplate = require('../views/products/index.js');

router.get('/', async(req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
});


module.exports = router;