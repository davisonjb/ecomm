const layout = require('../layout.js');

module.exports = ({ req }) => {
    return layout({
        content: `
        <div>
        Your id is: ${req.session.userId}
         <form method="POST">
             <input name="email" placeholder="email" />
             <input name="password" type="password" placeholder="password" />
             <input name="passwordconfirmation" type="password" placeholder="password confirmation" />
             <button>Sign Up</button>
         </form>
        </div>    
    `
    });
};