import { mysqlQuery } from '../connect-sql.js';
import * as uploadImage from './upload-aws.js';

export default class Ads {
    static getAll = (req, res) => {
        mysqlQuery('SELECT id,name,description,img,url FROM ms_ads GROUP BY institution_id ORDER BY id DESC LIMIT 3')
            .then((rows) => {
                console.log(rows);
                return res.send({ ads: rows });
            })
            .catch((err) =>
                setImmediate(() => {
                    throw err;
                }),
            );
    };

    static getById = (req, res) => {
        mysqlQuery('SELECT * FROM ms_ads WHERE id = ?', req.params.id)
            .then(function (rows) {
                res.end(JSON.stringify(rows[0]));
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
            url: req.body.url,
            institution_id: req.body.institution_id,
        };
        console.log(imgName);
        mysqlQuery('INSERT INTO `ms_ads` SET ? ', data)
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
