const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');
const productsRepo = require('../../repositories/products.js');
const productsNewTemplate = require('../../views/admin/products/new.js');
const { requireTitle, requirePrice } = require('./validators.js');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get('/admin/products', (req, res) => {

});

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new', [requireTitle, requirePrice], upload.single('image'), (req, res) => {
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.send(productsNewTemplate({ errors }));
    // }
    console.log(req.file);
    res.send('submitted');
})

module.exports = router;