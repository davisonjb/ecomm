const layout = require('../layout.js');
const { getError } = require('../../helpers.js');


module.exports = ({ req, errors }) => {
    return layout({
        content: `
        <div>
        Your id is: ${req.session.userId}
         <form method="POST">
             <input name="email" placeholder="email" />
             ${getError(errors, 'email')}
             <input name="password" type="password" placeholder="password" />
             ${getError(errors, 'password')}
             <input name="passwordconfirmation" type="password" placeholder="password confirmation" />
             ${getError(errors, 'passwordconfirmation')}
             <button>Sign Up</button>
         </form>
        </div>    
    `
    });
};