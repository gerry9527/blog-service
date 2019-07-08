
const express = require('express');
const router = express.Router();
const MsgBean = require('../utils/message.util');
const transcation = require('../utils/transaction.config');
const queryConfig = require('../utils/query.config');
const connectHandler = require('../db.config');
const formidable = require('formidable');
const jwt = require('jsonwebtoken'); */

let bodyParser = require('body-parser')
// create application/json parser
let jsonParser = bodyParser.json()
 
/**
 * 用户注册
 */
router.post('/imageUpload',(req, res, next) => {
        debugger
        let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        //上传到服务器指定文件夹
        form.uploadDir =`public/${constant.UPLOAD_FOLDER}`;
        form.keepExtensions = true;     //保留后缀
        form.maxFieldsSize = constant.IMAGE_SIZE;
        let data = new MsgBean('上传失败',1);
        form.parse(req, (err, fields, files) => {
            if (err) {
            data.setContent(err);
            res.send(data);
            return;
            }
            let file = files.file;
            let fileType = new RegExp(file.type, 'g');
            
            let isLegal = fileType.test(constant.IMAGE_TYPE);
            if(!isLegal) {//判断上传图片格式是否合法
                data.msg('非法的图片格式');
                res.send(data);
                return;
            }
            let fileSize = file.size;
            if(fileSize > constant.IMAGE_SIZE) {//上传图片超出最大限度
                data.msg('图片大小超出最大限制');
                res.send(data);
                return;
            }
            let index = file.name.lastIndexOf('.');
            let oldPath = files.file.path;
            let uploadDate = new Date().getTime();
            let fileName = `${file.name.slice(0, index)}_${uploadDate}_origin.${file.name.slice(index+1)}`;
            let newPath = `public/uploadImages/${fileName}`;
            fs.rename(oldPath, newPath, err => {//图片更名
                if(err) {
                    data.setContent('图片解析失败');
                    res.send(data);
                    return;
                }
                let baseUrl = req.headers.host;
                let imgUrl = `https://${baseUrl}/uploadImages/${fileName}`;
                let result =  {
                    imgUrl
                };
                data.setCode(0);
                data.setContent(result);
                data.setMsg('上传成功');
                res.send(data);
            });
        }) 
    })


module.exports = router;