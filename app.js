const mongoose = require('./common/db');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Manage = require('./model/manage');
const NhapHang = require('./model/nhaphang');
const XuatHang = require('./model/xuathang');
var isodate = require("isodate");
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
    list = []
    let body;
    if (req.body.lop == undefined) {
        body = {
            lop: 1
        }
    } else {
        body = {
            lop: req.body.lop
        }
    }

    Manage.find(body).exec().then(
        rs => {
            list = rs;
            res.render('nhapsachmoi', { list: list })
        }
    ).catch(
        err => res.render('nhapsachmoi', { list: list })
    )
});

app.post('/nhapsachmoi', (req, res) => {
    nhapsachmoi(req, res);
});

function nhapsachmoi(req, res) {
    let thanhtiennhap = 0;
    if (req.body.gianhap) {
        thanhtiennhap = (parseInt(req.body.gianhap) * parseInt(req.body.soluongnhap))
    }
    let data = {
        _id: new mongoose.Types.ObjectId(),
        tensach: req.body.tensach,
        lop: req.body.lop,
        gianhap: req.body.gianhap,
        soluongnhap: req.body.soluongnhap,
        thanhtiennhap: thanhtiennhap,
        giaxuat: req.body.giaxuat,
        soluongxuat: 0,
        thanhtienxuat: 0,
        tonkho: req.body.soluongnhap
    }

    let data_nhaphang = {
        _id: new mongoose.Types.ObjectId(),
        tensach: req.body.tensach,
        lop: req.body.lop,
        gianhap: req.body.gianhap,
        soluongnhap: req.body.soluongnhap,
        thanhtiennhap: thanhtiennhap,
    }

    NhapHang.create(data_nhaphang, (err, rs) => {
        if (err) console.log(err + '')
    })

    Manage.findOne({
            tensach: req.body.tensach,
            lop: req.body.lop
        }).then(
            rs => {
                if (rs != null) {
                    rs.gianhap = parseInt(req.body.gianhap)
                    rs.giaxuat = parseInt(req.body.giaxuat)
                    rs.soluongnhap = parseInt(rs.soluongnhap) + parseInt(req.body.soluongnhap)
                    rs.thanhtiennhap = rs.thanhtiennhap + parseInt(req.body.soluongnhap) * parseInt(req.body.gianhap)
                    rs.tonkho = rs.soluongnhap - rs.soluongxuat
                    rs.save(err => {
                        if (err) console.log(err + '')
                        Manage.find({ lop: req.body.lop }).exec().then(
                            rs => {
                                list = rs;
                                res.render('nhapsachmoi', { list: list })
                            }
                        ).catch(
                            err => res.render('nhapsachmoi', { list: list })
                        )
                    })
                } else {
                    Manage.create(data, (err, rs) => {
                        if (err) console.log(err + '')
                        Manage.find({ lop: req.body.lop }).exec().then(
                            rs => {
                                list = rs;
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
}

app.get('/nhapsachdaco', (req, res) => {
    let listSach = []
    let body;
    if (req.body.lop == undefined) {
        body = {
            lop: 1
        }
    } else {
        body = {
            lop: req.body.lop
        }
    }

    Manage.find(body).exec().then(
        rs => {
            listSach = rs;
            res.render('nhapsachdaco', { list: listSach })
        }
    ).catch(
        err => res.render('nhapsachdaco', { list: listSach })
    )
});

app.post('/nhapsachdaco', (req, res) => {
    nhapsachdaco(req, res)
});

function nhapsachdaco(req, res) {

    Manage.findOne({
            tensach: req.body.tensach,
            lop: req.body.lop
        }).then(
            rs => {
                if (rs != null) {
                    rs.soluongnhap = parseInt(rs.soluongnhap) + parseInt(req.body.soluongnhap)
                    rs.thanhtiennhap = rs.thanhtiennhap + rs.gianhap * parseInt(req.body.soluongnhap)
                    rs.tonkho = rs.soluongnhap - rs.soluongxuat

                    let data_nhaphang = {
                        _id: new mongoose.Types.ObjectId(),
                        tensach: req.body.tensach,
                        lop: req.body.lop,
                        gianhap: rs.gianhap,
                        soluongnhap: req.body.soluongnhap,
                        thanhtiennhap: req.body.soluongnhap * rs.gianhap
                    }

                    NhapHang.create(data_nhaphang, (err, rs) => {
                        if (err) console.log(err + '')
                    })
                    rs.save(err => {
                        if (err) console.log(err + '')
                        Manage.find({ lop: req.body.lop }).exec().then(
                            rs => {
                                list = rs;
                                res.render('nhapsachdaco', { list: list })
                            }
                        ).catch(
                            err => res.render('nhapsachdaco', { list: list })
                        )
                    })
                }
            }
        )
        .catch(err => console.log(err + ''))
}

app.get('/nhapbosach', (req, res) => {
    let listSach = []
    let body;
    if (req.body.lop == undefined) {
        body = {
            lop: 1
        }
    } else {
        body = {
            lop: req.body.lop
        }
    }

    Manage.find(body).exec().then(
        rs => {
            listSach = rs;
            res.render('nhapbosach', { list: listSach })
        }
    ).catch(
        err => res.render('nhapbosach', { list: listSach })
    )
});

app.post('/nhapbosach', (req, res) => {
    nhapbosach(req, res)
});

function nhapbosach(req, res) {

    Manage.find({
            lop: req.body.lop
        }).exec()
        .then(rs => {
            let promi = new Promise(resolve => {
                let el;
                let tmp = rs.length - 1
                for (let i = 0; i <= tmp; i++) {
                    el = rs[i]
                    el.soluongnhap = parseInt(el.soluongnhap) + parseInt(req.body.soluongnhap)
                    el.thanhtiennhap = el.thanhtiennhap + el.gianhap * parseInt(req.body.soluongnhap)
                    el.tonkho = el.soluongnhap - el.soluongxuat

                    let data_nhaphang = {
                        _id: new mongoose.Types.ObjectId(),
                        tensach: el.tensach,
                        lop: req.body.lop,
                        gianhap: el.gianhap,
                        soluongnhap: req.body.soluongnhap,
                        thanhtiennhap: req.body.soluongnhap * el.gianhap
                    }

                    NhapHang.create(data_nhaphang, (err, rs) => {
                        if (err) console.log(err + '')
                    })

                    el.save(err => {
                        if (err) console.log(err + '')
                        if (i == tmp) {
                            resolve()
                        }
                    })
                }
            })

            promi.then(() => {
                Manage.find({ lop: req.body.lop }).exec().then(
                    rs => {
                        list = rs;
                        res.render('nhapbosach', { list: list })
                    }
                ).catch(
                    err => res.render('nhapbosach', { list: list })
                )
            })
        })
}

let tonkho = 0;
app.get('/xuatsachle', (req, res) => {
    tonkho = 0;
    let listSach = []
    let body;
    if (req.body.lop == undefined) {
        body = {
            lop: 1
        }
    } else {
        body = {
            lop: req.body.lop
        }
    }

    Manage.find(body).exec().then(
        rs => {
            listSach = rs;

            if (req.body.lop == undefined) {
                tonkho = rs[0].tonkho
            }
            res.render('xuatsachle', { list: listSach, tonkho: tonkho })
        }
    ).catch(
        err => {
            res.render('xuatsachle', { list: listSach, tonkho: tonkho })
        }
    )

});

app.post('/xuatsachle', (req, res) => {
    xuatsachle(req, res)
});

function xuatsachle(req, res) {
    tonkho = 0;
    Manage.findOne({
            tensach: req.body.tensach,
            lop: req.body.lop
        }).then(
            rs => {
                if (rs != null) {
                    rs.soluongxuat = parseInt(rs.soluongxuat) + parseInt(req.body.soluongxuat)
                    rs.thanhtienxuat = rs.thanhtienxuat + rs.giaxuat * parseInt(req.body.soluongxuat)
                    rs.tonkho = rs.soluongnhap - rs.soluongxuat
                    tonkho = rs.tonkho
                    let data_xuathang = {
                        _id: new mongoose.Types.ObjectId(),
                        tensach: req.body.tensach,
                        lop: req.body.lop,
                        giaxuat: rs.giaxuat,
                        soluongxuat: req.body.soluongxuat,
                        thanhtienxuat: req.body.soluongxuat * rs.giaxuat
                    }

                    XuatHang.create(data_xuathang, (err, rs) => {
                        if (err) console.log(err + '')
                    })
                    rs.save(err => {
                        if (err) console.log(err + '')
                        Manage.find({ lop: req.body.lop }).exec().then(
                            rs => {
                                list = rs;
                                res.render('xuatsachle', { list: list, tonkho: tonkho })
                            }
                        ).catch(
                            err => res.render('xuatsachle', { list: list, tonkho: tonkho })
                        )
                    })
                }
            }
        )
        .catch(err => console.log(err + ''))
}

let botonkho = 0
app.get('/xuatsachbo', (req, res) => {
    botonkho = 0;
    let listSach = []
    let body = {
        lop: 1
    }

    Manage.find(body).sort({ tonkho: 'asc' }).exec().then(
        rs => {
            if (rs != null) {
                listSach = rs;
                botonkho = rs[0].tonkho
            }

            res.render('xuatsachbo', { list: listSach, botonkho: botonkho })
        }
    ).catch(
        err => {
            res.render('xuatsachbo', { list: listSach, botonkho: botonkho })
        }
    )
})

app.post('/getbosachtonkho', (req, res) => {
    botonkho = 0;
    let body = {
        lop: req.body.lop
    }

    Manage.find(body).sort({ tonkho: 'asc' }).exec().then(
        rs => {
            if (rs != null && rs.length > 0) {
                botonkho = rs[0].tonkho
            }

            res.status(200).json({ botonkho: botonkho })
        }
    ).catch(
        err => {
            res.status(400).json({ botonkho: botonkho })
        }
    )
})

app.post('/xuatsachbo', (req, res) => {
    xuatsachbo(req, res)
});

function xuatsachbo(req, res) {

    Manage.find({
            lop: req.body.lop
        }).sort({ tonkho: 'asc' }).exec()
        .then(rs => {
            let promi = new Promise(resolve => {
                let el;
                let tmp = rs.length - 1
                for (let i = 0; i <= tmp; i++) {
                    el = rs[i]
                    el.soluongxuat = parseInt(el.soluongxuat) + parseInt(req.body.soluongxuat)
                    el.thanhtienxuat = el.thanhtienxuat + el.giaxuat * parseInt(req.body.soluongxuat)
                    el.tonkho = el.soluongnhap - el.soluongxuat
                    if (i == 0) {
                        botonkho = el.tonkho
                    }

                    let data_xuathang = {
                        _id: new mongoose.Types.ObjectId(),
                        tensach: el.tensach,
                        lop: req.body.lop,
                        giaxuat: el.giaxuat,
                        soluongxuat: req.body.soluongxuat,
                        thanhtienxuat: req.body.soluongxuat * el.giaxuat
                    }

                    XuatHang.create(data_xuathang, (err, rs) => {
                        if (err) console.log(err + '')
                    })

                    el.save(err => {
                        if (err) console.log(err + '')
                        if (i == tmp) {
                            resolve()
                        }
                    })
                }
            })

            promi.then(() => {
                Manage.find({ lop: req.body.lop }).exec().then(
                    rs => {
                        list = rs;
                        res.render('xuatsachbo', { list: list, botonkho: botonkho })
                    }
                ).catch(
                    err => res.render('xuatsachbo', { list: list, botonkho: botonkho })
                )
            })
        })
}
let phanloai = 1
app.get('/thongke', (req, res) => {
    phanloai = 1
    listThongKe = []
    res.render('thongke', { list: listThongKe, phanloai: phanloai })
});

let listThongKe = []
app.post('/thongke', (req, res) => {
    listThongKe = []
    let pl = req.body.phanloai
    let date1 = convertIsoDate(req.body.ngaybatdau, true)
    let date2 = convertIsoDate(req.body.ngayketthuc, false)
    if (pl == 1) {
        NhapHang.find({ "date": { "$gte": date1, "$lte": date2 } })
            .exec().then(rs => {

                listThongKe = rs
                phanloai = 1
                res.render('thongke', { list: listThongKe, phanloai: phanloai })
            })
            .catch(err => {
                phanloai = 1
                res.render('thongke', { list: listThongKe, phanloai: phanloai })
            })
    } else {
        XuatHang.find({ "date": { "$gte": date1, "$lte": date2 } })
            .exec().then(rs => {
                listThongKe = rs
                phanloai = 2
                res.render('thongke', { list: listThongKe, phanloai: phanloai })
            })
            .catch(err => {
                phanloai = 2
                res.render('thongke', { list: listThongKe, phanloai: phanloai })
            })
    }
});

function convertIsoDate(date, flag) {
    let dt = new Date(date)
    let year = dt.getFullYear()
    let month = ((dt.getMonth() + 1).toString().length == 1) ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1)
    let d = dt.getDate().toString().length == 1 ? '0' + dt.getDate() : dt.getDate()
    let vl
    if (flag) {
        vl = year + '-' + month + '-' + d + 'T00:00:00Z'
    } else {
        vl = year + '-' + month + '-' + d + 'T23:59:59Z'
    }
    return isodate(vl)
}


app.post('/laytonkho', (req, res) => {
    tonkho = 0;
    let body = {
        lop: parseInt(req.body.lop),
        tensach: req.body.tensach
    }

    Manage.findOne(body).exec().then(
        rs => {
            if (rs != null)
                tonkho = rs.tonkho
            res.status(200).json({ tonkho })

        }
    ).catch(
        err => res.status(404).json({ tonkho })
    )
});

app.post('/layds', (req, res) => {
    list = []
    let body = {
        lop: parseInt(req.body.lop)
    }
    Manage.find(body).exec().then(
        rs => {
            list = rs;
            res.status(200).json({ list })
        }
    ).catch(
        err => res.status(404).json({ list })
    )
});

app.listen(3000, () => {
    console.log('Server started on port ' + 3000);
});