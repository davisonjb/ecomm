const express = require('express');
const usersRepo = require('../../repositories/users.js');
const router = express.Router();
const signUpTemplate = require('../../views/admin/auth/signup.js');
const signInTemplate = require('../../views/admin/auth/signin.js');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators.js');
const { handleErrors } = require('./middlewares.js');



router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }));
});

router.post('/signup', [requireEmail, requirePassword, requirePasswordConfirmation], handleErrors(signUpTemplate), async(req, res) => {

    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });
    req.session.userId = user.id;

    res.redirect('/admin/products');
});


router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/signin');
});

router.get('/signin', (req, res) => {
    res.send(signInTemplate({}));
});

router.post('/signin', [requireEmailExists, requireValidPasswordForUser], handleErrors(signInTemplate), async(req, res) => {

    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;
    res.redirect('/admin/products');
});

module.exports = router;