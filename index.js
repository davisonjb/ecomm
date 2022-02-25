const express = require('express');
// const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users.js');
const { response } = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['asdfas$#df#$%#$%asdfasfasdf']
}));

app.get('/signup', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account</title>
    </head>
    <body>
       <div>
       Your id is: ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" type="password" placeholder="password" />
            <input name="passwordconfirmation" type="password" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
       </div>    
       </body>
       </html> 
    `);
});


// const bodyParser = (req, res, next) => {
//     if (req.method === 'POST') {
//         req.on('data', data => {
//             const parsed = data.toString('utf8').split('&');
//             const formData = {};
//             for (let pair of parsed) {
//                 const [key, value] = pair.split('=');
//                 formData[key] = value;
//             }
//             req.body = formData;
//             next();
//         });
//     } else {
//         next();
//     }
// };


app.post('/signup', async(req, res) => {
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


app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out.')
});

app.get('/signin', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account</title>
    </head>
    <body>
       <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" type="password" placeholder="password" />
            <button>Sign In</button>
        </form>
       </div>    
       </body>
       </html>  
    `)
});

app.post('/signin', async(req, res) => {
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



app.listen(3000, () => {
    console.log('Active');
})