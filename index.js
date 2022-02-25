const express = require('express');
// const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
// const { response } = require('express');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['asdfas$#df#$%#$%asdfasfasdf']
}));
app.use(authRouter);
app.use(productsRouter);




app.listen(3000, () => {
    console.log('Active');
})