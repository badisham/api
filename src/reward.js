// var mysql = require('mysql');
// var connection = require('../connect-sql');
// const uploadImage = require('./upload-aws');
import jwt from 'jsonwebtoken';
import mysql from 'mysql';
import { mysqlQuery } from '../connect-sql.js';
import * as uploadImage from './upload-aws.js';
import { jwtEnv } from './constance/config.js';
import ms from 'ms';

export default class Reward {
    static getAll = (req, res) => {
        mysqlQuery(
            'SELECT ms_reward.id as id,ms_reward.name as name,ms_reward.description as description,ms_reward.img as img,institution.name as institution_name,ms_reward.use_star_point as use_star_point FROM ms_reward INNER JOIN institution ON institution.id = ms_reward.institution_id',
        )
            .then((rows) => {
                return res.send({ rewards: rows });
            })
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                }),
            );
    };

    static getById = (req, res) => {
        mysqlQuery('SELECT * FROM ms_reward WHERE id = ?', req.params.id)
            .then(function (rows) {
                return res.send(rows);
            })
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                }),
            );
    };

    static create = async (req, res) => {
        let imgName = '';
        imgName = await uploadImage.uploadToS3(req.files.file);
        const data = {
            name: req.body.name,
            description: req.body.description,
            img: imgName,
            use_star_point: req.body.use_star_point,
            institution_id: req.body.institution_id,
        };
        console.log(imgName);
        mysqlQuery('INSERT INTO `ms_reward` SET ? ', data)
            .then(function (rows) {})
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                }),
            );
        return res.send('<script> window.close();</script>');
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
