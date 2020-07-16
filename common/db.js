const mongoose = require('mongoose');
const DB_URL = "mongodb://localhost:27017/ng7crud"

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true },
    (err) => {
        if (!err) {
            console.log('MongoDB Connection Succeeded.')
        } else {
            console.log('Error in DB connection : ' + err)
        }
    });

module.exports = mongoose;