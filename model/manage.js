const mongoose = require('../common/db');
const { Schema } = require('../common/db');

let ManageSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    tensach: {
        type: String
    },
    lop: {
        type: String
    },
    gianhap: {
        type: Number
    },
    soluongnhap: {
        type: Number
    },
    thanhtiennhap: {
        type: Number
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
    tonkho: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'manage'
});

module.exports = mongoose.model('manage', ManageSchema);