const express = require('express');
const usersRepo = require('../../repositories/users.js');
const router = express.Router();
const signUpTemplate = require('../../views/admin/auth/signup.js');
const signInTemplate = require('../../views/admin/auth/signin.js');
const { check, validationResult } = require('express-validator');


router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }));
});

router.post('/signup', [
        check('email').trim().normalizeEmail().isEmail(),
        check('password').trim().isLength({ min: 4, max: 20 }),
        check('passwordconfirmation').isLength({ min: 4, max: 20 })
    ],
    async(req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        const { email, password, passwordconfirmation } = req.body;

        const existingUser = await usersRepo.getOneBy({ email });
        if (existingUser) {
            throw new Error('Email already exist.');
        }

        if (password !== passwordconfirmation) {
            throw new Error('Passwords must match.')
        }
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

router.post('/signin', async(req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy({ email });
    if (!user) {
        return res.send('Email not found.');
    }
    const validPassword = await usersRepo.comparePasswords(user.password, password);
    if (!validPassword) {
        return res.send('Invalid username or password.');
    }

    req.session.userId = user.id;
    res.send('You are signed in.');
});

module.exports = router;