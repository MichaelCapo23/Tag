// const wrap = require("./wrap");
// const nodeFns = require('./nodeFns');
const md5 = require('md5');
const moment = require('moment');

module.exports = (app, db) => {
    app.post('/signup', (req, res) => {
        let params = ['first_name', 'last_name', 'password', 'email', 'username', 'dob', 'phone', 'rights'];
        // let newPassword = await nodeFns.checkPassword(app, db, password);
        // if (!newPassword) {
        //     let output = {
        //         status: 'NO',
        //         errMessage: 'Invalid Username/Password',
        //     };
        //     res.send(output);
        //     return;
        // }
        let cols = [];
        let vals = [];
        for (let i in params) {
            let pair = params[i];
            if(req.headers.hasOwnProperty(pair)) {
                cols.push(pair);
                let value = req.headers[pair];
                if (pair == "password") {
                    value = md5(req.headers[pair]);
                }
                vals.push(value);
            } else {
                res.send('Missing param '+pair+' --signup.js');
                return;
            }
        }
        db.connect(() => {
            let sql = "INSERT INTO `users` (" + cols + ") VALUES (?)";
            db.query(sql, [vals], (err, data1) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }

                let token = md5(moment()+req.headers['password']+req.headers['username']);
                let output = {
                    status: "OK",
                    token: token
                };
                let name = req.headers['first_name'];
                let expiration = moment().add(3, 'days').format('YYYY-MM-DD');
                let sql2 = "INSERT INTO `session` SET `user` = ?, `token` = ?, `expiration` = ?";
                db.query(sql2, [name, token, expiration], (err, data2) => {
                    if(err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                });
                res.send(output);
            })
        })
    });
};