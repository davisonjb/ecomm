const express = require('express');
// const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users.js')

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
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
            <input name="password" placeholder="password" />
            <input name="passwordconfirmation" placeholder="password confirmation" />
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


app.post('/', async(req, res) => {
    const { email, password, passwordconfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        throw new Error('Email already exist.');
    }

    if (password !== passwordconfirmation) {
        throw new Error('Passwords must match.')
    }
    usersRepo.create(req.body);
    res.send('Account created.');
});



app.listen(3000, () => {
    console.log('Active');
})