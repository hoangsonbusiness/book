const mongoose = require('./common/db');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const NhapHang = require('./model/nhaphang');
// const cors = require('cors');
const app = express();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(urlencodedParser);
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
// app.use('/static', express.static(path.join(__dirname, 'uploads')))
app.set('view engine', 'ejs');

// Index Route
app.get('/', (req, res) => {
    res.render('index')
});
let list = []
app.get('/nhapsachmoi', (req, res) => {
    NhapHang.find({}).exec().then(
            rs => {
                list = rs;
                console.log(list)
                res.render('nhapsachmoi', { list: list })
            }
        ).catch(
            err => res.render('nhapsachmoi', { list: list })
        )
        // res.render('nhapsachmoi', { list: list })
});

app.post('/nhapsachmoi', async(req, res) => {
    let thanhtien = 0;
    if (req.body.gia) {
        thanhtien = (parseInt(req.body.gia) * parseInt(req.body.soluong))
    }
    let data = {
        _id: new mongoose.Types.ObjectId(),
        tensach: req.body.tensach,
        lop: req.body.lop,
        dongia: req.body.gia,
        soluong: req.body.soluong,
        thanhtien: thanhtien
    }
    console.log('data request :' + JSON.stringify(data))
    NhapHang.findOne({
            tensach: req.body.tensach,
            lop: req.body.lop
        }).exec().then(
            rs => {
                console.log('kq tim :' + rs)
                if (rs && rs.length > 0) {
                    console.log('vao update')
                    NhapHang.save({
                            _id: rs._id
                        }, {
                            $set: {
                                soluong: rs.soluong + req.body.soluong,
                                thanhtien: rs.dongia * (rs.soluong + req.body.soluong)
                            }
                        },
                        err => {
                            if (err) console.log(err + '')
                            console.log("update successfully")
                            NhapHang.find({ lop: req.body.lop }).exec().then(
                                rs => {
                                    list = rs;
                                    console.log(list)
                                    res.render('nhapsachmoi', { list: list })
                                }
                            ).catch(
                                err => res.render('nhapsachmoi', { list: list })
                            )
                        })
                } else {
                    console.log('vao insert')
                    NhapHang.create(data, (err, rs) => {
                        if (err) console.log(err + '')
                        console.log("add successfully")
                        NhapHang.find({ lop: req.body.lop }).exec().then(
                            rs => {
                                list = rs;
                                console.log(list)
                                res.render('nhapsachmoi', { list: list })
                            }
                        ).catch(
                            err => res.render('nhapsachmoi', { list: list })
                        )
                    })
                }
            }
        )
        .catch(err => console.log(err + ''))
        // res.render('nhapsachmoi', { list: list })
        // NhapHang.create(data, (err, rs) => {
        //         if (err) console.log(err + '')
        //         console.log("add successfully")
        //     })
        // console.log(req.body.tensach)


});

app.get('/nhapsachdaco', (req, res) => {
    res.render('nhapsachdaco')
});

app.get('/nhapbosach', (req, res) => {
    res.render('nhapbosach')
});

app.listen(3000, () => {
    console.log('Server started on port ' + 3000);
});