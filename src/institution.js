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

    static create = (req, res) => {
        const data = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            type: req.body.type,
        };
        mysqlQuery('SELECT id FROM member WHERE username = ?', req.body.username).then((rows) => {
            if (rows.length == 0) {
                mysqlQuery('INSERT INTO member SET ?', data);
            } else {
                console.log('username exist');
                return res.status(403).send({ msg: 'มี username นี้แล้ว' });
            }
        });
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
