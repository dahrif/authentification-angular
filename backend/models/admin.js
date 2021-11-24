// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const adminSchema = new Schema({
//     username : {type: String, required: true },
//     email : {type: String, required: true, unique: true },
//     password :{type: String, required: true } 
// })

// module.exports = mongoose.model('admin', adminSchema, 'admins')


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// define User Schema
const adminSchema = new Schema({
    username: { type: String, required: true },
    email : { type: String, required: true, unique: true },
    hashed_password: { type: String, default: ''
    }
});

adminSchema
    .virtual('password')
    // set methods
    .set(function (password) {
        this._password = password;
    });

adminSchema.pre("save", function (next) {
    // store reference
    const admin = this;
    if (admin._password === undefined) {
        return next();
    }
    bcrypt.genSalt( function (err, salt) {
        if (err) console.log(err);
        // hash the password using our new salt
        bcrypt.hash(admin._password, salt, function (err, hash) {
            if (err) console.log(err);
            admin.hashed_password = hash;
            next();
        });
    });
});

adminSchema.methods = {
    comparePassword: function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    }
}


module.exports = mongoose.model('admins', adminSchema)
