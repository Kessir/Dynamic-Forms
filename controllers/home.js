const shortid = require('shortid');
const Category = require('../models/Category');
const User = require('../models/User');




/**
 * POST /responses/new
 * Handles student response form.
 */
exports.postResponse = (req, res, next) => {
    console.log(req.body);

    var user = req.user;

    // loops through body params, push onto user's responses[]
    for (var propName in req.body) {
        // if property exists and has a value
        if (req.body.hasOwnProperty(propName) && req.body[propName]) {
            // console.log(propName, req.body[propName]);
            user.responses.push({fieldID: propName,value: req.body[propName]});
        }
    }

    user.save(function (err) {
        if (err) { return next(err); }
        req.flash('success',  { msg: 'Your data Was successfully uploaded'});
        res.redirect('.');
    });


};
