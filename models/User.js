const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//authenticate input against database documents
UserSchema.statics.authenticate = function(email,password,callback) {
    User.find({email:email})
    .exec((err,user => {
        if (err) {
            return callback(err);
        } else if (!user) {
            var err = new Error('User not found');
            err.status = 401;
            return callback(err);
        }

        bcrypt.compare(password, user.password, (err,result) => {
            if (result == true) {
                return callback(null,user);
            } else {
                return callback();
            }
        })
    }))
}


//hash user password before storing into database
UserSchema.pre('save', (next) => {
    var user = this;
    bcrypt.hash(user.password, 10, (err,hash) => {
        if (err) {
            return next(err)
        }

        user.password = hash;
        next();
    })
})


var User = mongoose.model('User', UserSchema);
module.exports = User;