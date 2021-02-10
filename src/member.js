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
                })
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
                })
            );
    };

    static register = (req, res) => {
        mysqlQuery('INSERT INTO member SET ?', req.body)
            .then(function (rows) {
                // res.end(JSON.stringify(row));
                res.end('last ID: ' + rows.insertId);
            })
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                })
            );
    };

    static login = (req, res) => {
        const { username, password } = req.headers;

        console.log(username, password);
        mysqlQuery(
            'SELECT * FROM member WHERE username = ? AND password = ? LIMIT 1',
            [username, password]
        )
            .then(function (rows) {
                console.log(rows);
                if (rows.length > 0) {
                    const token = jwt.sign(
                        { id: rows[0].id, username: rows[0].username },
                        jwtEnv.secretKey,
                        { expiresIn: ms('30s') / 1000 }
                    );
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

        mysqlQuery(
            'UPDATE member SET username = ?, password = ?, name = ? WHERE id = ?',
            data
        )
            .then(function (rows) {
                // res.send(true);
                res.end(JSON.stringify(rows));
            })
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                })
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
                })
            );
    };
}

// export default { getAll, getById, register, login, edit, remove };
