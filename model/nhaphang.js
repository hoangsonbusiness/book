const mongoose = require('../common/db');
const { Schema } = require('../common/db');

let NhapHangSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    tensach: {
        type: String
    },
    lop: {
        type: String
    },
    dongia: {
        type: Number
    },
    soluong: {
        type: Number
    },
    thanhtien: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'nhaphang'
});

module.exports = mongoose.model('NhapHang', NhapHangSchema);