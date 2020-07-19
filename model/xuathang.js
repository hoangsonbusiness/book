const mongoose = require('../common/db');
const { Schema } = require('../common/db');

let XuatHangSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    tensach: {
        type: String
    },
    lop: {
        type: String
    },
    giaxuat: {
        type: Number
    },
    soluongxuat: {
        type: Number
    },
    thanhtienxuat: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'xuathang'
});

module.exports = mongoose.model('XuatHang', XuatHangSchema);