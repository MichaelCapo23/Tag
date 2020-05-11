const wrap = require("./wrap");
const md5 = require('md5');

module.exports = async (app, db) => {
    app.post('/loginUser', (req, res) => {
        let output = {
            status: "NO",
            errMessage: 'Invalid Username/Password'
        };
        let {email, password} = req.headers;
        password = md5(password);
        db.connect(() => {
            let sql = "SELECT `token` FROM `accounts` WHERE `email` = ? AND `password` = ?";
            db.query(sql, [email, password], (err, data) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                if (data.length > 0) {
                    output = {
                        status: "OK",
                        token: data[0].token
                    };
                }
                res.send(output);
            })
        })
    })
};