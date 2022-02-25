const layout = require('../layout.js');

module.exports = () => {
    return layout({
        content: `
       <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" type="password" placeholder="password" />
            <button>Sign In</button>
        </form>
       </div>    
    `
    });
};