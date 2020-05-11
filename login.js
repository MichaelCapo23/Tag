const md5 = require('md5');
const moment = require('moment');

module.exports = async (app, db) => {
    app.post('/login', (req, res) => {
        let output = {
            status: "NO",
            errMessage: 'Invalid Username/Password'
        };
        let {email, password} = req.headers;
        password = md5(password);
        db.connect(() => {
            let sql = "SELECT `first_name`, `last_name`, `username`, `phone`, `email` FROM `users` WHERE `username` = ? AND `password` = ?";
            db.query(sql, [email, password], (err, data1) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                if (data.length > 0) {
                    let name = data1[0].first_name+'_'+data1[0].last_name;
                    let token = md5(moment()+password+email);
                    let expiration = moment().add(3, 'days').format('YYYY-MM-DD');
                    let sql2 = "INSERT INTO `session` SET `user` = ? AND `token` = ? AND `expiration` = ?";
                    db.query(sql2, [name, token, expiration])
                    output = {
                        status: "OK",
                        first_name: data1[0].first_name,
                        last_name: data1[0].last_name,
                        username: data1[0].username,
                        phone: data1[0].phone,
                        email: data1[0].email
                    };
                } else {
                    output = {
                        status: "OK",
                        error: 'Invalid Username or Password'
                    };
                }
                res.send(output);
            })
        })
    })
};