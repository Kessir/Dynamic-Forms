const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Category = require('../models/Category');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    google: String,
    github: String,
    tokens: Array,

    userType: { type: String, enum:['student', 'staff', 'admin'], default:'student'},
    isApproved: { type: Boolean, default: false},

    profile: {
        name: { type: String, default: '' },
        gender: { type: String, default: '' },
        location: { type: String, default: '' },
        website: { type: String, default: '' },
        picture: { type: String, default: '' }
    },
    responses: [{
        fieldID: { type: String, ref: 'Trip' },
        value: String
    }]

}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size) {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

/**
 * Helper method for getting all users of type 'student'.
 */
userSchema.statics.findStudents = function findStudents ( callback) {
    User.find({'userType':'student'},
        {},
        callback
    );
};

/**
 * Helper method for getting all users who have submitted some data.
 */
userSchema.statics.getRespondents = function getRespondents (callback) {
    User.find({'userType':'student', 'responses.0':{ "$exists": true } },
        {},
        callback
    );
};

/**
 * Helper method for getting email addressed of all students.
 */
userSchema.statics.getAllEmails = function getAllEmails (callback) {
    User.find({'userType':'student'},
        {},
        function (err,users) {
            if(err){return callback(err, null)}

            var emails = users.map(function (x) {
               return  {email: x.email};
            });
            callback(null, emails);
        }
    );
};

/**
 * Helper method for getting a student responses.
 */
userSchema.statics.getStudentResponses = function getStudentResponses (id, callback) {
    User.findOne({'_id':id},
        {},
        function (err, student) {
            if(err){ return callback(err, null); }
            // console.log("in model student: " + student);

            // Making array a dictionary(map)
            var responseMap = {};
            student.responses.forEach(function (response) {
                responseMap[response.fieldID] = response.value;
            });

            var cats = [];
            Category.findAll(function (err, categories) {
                categories.forEach(function (category, i) {
                    var cat = {fields:[], title:category.title, description:category.description};
                    cats.push(cat);
                    category.fields.forEach(function (field, j) {
                        cats[i].fields.push({fieldID: field.fieldID ,title: field.title, inputType:field.inputType,description:field.description, value : responseMap[field.fieldID]});
                        // console.log("in field: "+ JSON.stringify(cats[i].fields[j]));

                    });
                });
                callback(null, {student: student, categories:cats});
            });
        }
    );
};

/**
 * Helper method for getting CSV ready student responses.
 */
userSchema.statics.getCsvReadyResponses = function getCsvReadyResponses (id, callback) {
    User.findOne({'_id':id},
        {},
        function (err, student) {
            if(err){ return callback(err, null); }
            // console.log("in model student: " + student);

            // Making array a dictionary(map)
            var responseMap = {};
            console.log("in model student: " + JSON.stringify(student['responses']));
            student.responses.forEach(function (response) {
                responseMap[response.fieldID] = response.value;
            });

            var responses = [];
            Category.findAll(function (err, categories) {
                categories.forEach(function (category, i) {
                    category.fields.forEach(function (field, j) {
                        responses.push({fieldID: field.fieldID ,title: field.title , value : responseMap[field.fieldID], category:category.title, student: student.profile.name});
                    });
                });
                console.log("in model: "+ responses);
                callback(null, responses);
            });
        }
    );
};


const User = mongoose.model('User', userSchema);
module.exports = User;
