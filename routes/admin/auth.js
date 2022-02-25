const express = require('express');
const usersRepo = require('../../repositories/users.js');
const router = express.Router();
const signUpTemplate = require('../../views/admin/auth/signup.js');
const signInTemplate = require('../../views/admin/auth/signin.js');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators.js');
const { check, validationResult } = require('express-validator');


router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }));
});

router.post('/signup', [requireEmail, requirePassword, requirePasswordConfirmation], async(req, res) => {


    const { email, password, passwordconfirmation } = req.body;
    const user = await usersRepo.create({ email, password });
    req.session.userId = user.id;

    res.send('Account created.');
});


router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out.')
});

router.get('/signin', (req, res) => {
    res.send(signInTemplate({ req }));
});

router.post('/signin', [requireEmailExists, requireValidPasswordForUser], async(req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        //  return res.send(signUpTemplate({ req, errors }));
        return res.send('Problems occured');
    }

    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;
    res.send('You are signed in.');
});

module.exports = router;