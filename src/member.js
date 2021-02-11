// var mysql = require('mysql');
// var connection = require('../connect-sql');
// const uploadImage = require('./upload-aws');
import jwt from 'jsonwebtoken';
import mysql from 'mysql';
import { mysqlQuery } from '../connect-sql.js';
import * as uploadImage from './upload-aws.js';
import { jwtEnv } from './constance/config.js';
import ms from 'ms';

export default class Member {
    static getAll = (req, res) => {
        mysqlQuery('SELECT * FROM member')
            .then((rows) => {
                res.end(JSON.stringify(rows));
            })
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                }),
            );
    };

    static getById = (req, res) => {
        mysqlQuery('SELECT * FROM member WHERE id = ?', req.params.id)
            .then(function (rows) {
                res.end(JSON.stringify(rows[0]));
            })
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                }),
            );
    };

    static register = (req, res) => {
        const data = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            type: req.body.type,
        };
        mysqlQuery('SELECT id FROM member WHERE username = ?', req.body.username).then((rows) => {
            if (rows.length == 0) {
                mysqlQuery('INSERT INTO member SET ?', data)
                    .then(function (rows) {
                        const member_id = rows.insertId;
                        var sql = 'INSERT INTO game_score (score, game, member_id) VALUES ?';
                        var values = [
                            [0, 'note', member_id],
                            [0, 'ball', member_id],
                            [0, 'rhythm', member_id],
                            [0, 'sound', member_id],
                        ];
                        mysqlQuery(sql, [values])
                            .then((row) => {
                                return res.send('success');
                            })
                            .catch((err) => {
                                console.log('fail ins score');
                                return res.status(403).send({ msg: err });
                            });
                    })
                    .catch((err) => {
                        console.log('fail insert');
                        return res.status(403).send({ msg: err });
                    });
            } else {
                console.log('username exist');
                return res.status(403).send({ msg: 'มี username นี้แล้ว' });
            }
        });
    };

    static login = (req, res) => {
        const { username, password } = req.headers;

        console.log(username, password);
        mysqlQuery('SELECT * FROM member WHERE username = ? AND password = ? ', [username, password])
            .then(function (rows) {
                console.log(rows);
                if (rows.length > 0) {
                    const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, jwtEnv.secretKey, {
                        expiresIn: ms('30s') / 1000,
                    });
                    return res.send({ token });
                } else {
                    return res.status(403).send({ error: 'No account' });
                }
            })
            .catch((err) => {
                console.log(err);
                setImmediate(() => {
                    return res.status(403).send({ error: err });
                });
            });
    };

    static gameLogin = (req, res) => {
        const { username, password } = req.body;

        console.log(username, password);
        mysqlQuery('SELECT * FROM member WHERE username = ? AND password = ? ', [username, password])
            .then(function (rows) {
                console.log(rows);
                if (rows.length > 0) {
                    return res.send({
                        id: rows[0].id,
                        username: rows[0].username,
                    });
                } else {
                    return res.status(403).send({ error: 'No account' });
                }
            })
            .catch((err) => {
                console.log(err);
                setImmediate(() => {
                    return res.status(403).send({ error: err });
                });
            });
    };

    static checkLogin = (req, res, next) => {
        const { token } = req.headers;

        try {
            if (jwt.verify(token, jwtEnv.secretKey)) {
                next();
            } else {
                return res.status(403).send('a');
            }
        } catch (err) {
            return res.status(403).send(err);
        }
    };

    static edit = (req, res) => {
        const body = req.body;
        const id = req.params.id;
        let data = [body.username, body.password, body.name, id];

        mysqlQuery('UPDATE member SET username = ?, password = ?, name = ? WHERE id = ?', data)
            .then(function (rows) {
                // res.send(true);
                res.end(JSON.stringify(rows));
            })
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                }),
            );
    };

    static remove = (req, res) => {
        mysqlQuery('DELETE FROM member WHERE id = ?', req.params.id)
            .then(function (result) {
                res.end(JSON.stringify(result));
            })
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                }),
            );
    };
}

// export default { getAll, getById, register, login, edit, remove };
