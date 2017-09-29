const shortid = require('shortid');
const Category = require('../models/Category');
const User = require('../models/User');
const csv = require('csv-express');
const Mailer = require('../utils/Mailer');

/**
 * GET /
 * Home page.
 */
/*
exports.index = (req, res) => {
    console.log(req.user);
    if (req.user.userType == 'student'){
        Category.findAll(function (err, categories) {
            res.render('home', {
                title: 'Home',
                categories: categories
            });
        });

    }else{
        res.redirect('/staff');
    }

};
*/


/**
 * GET /
 * Home page.
 */
exports.index = (req, res, next) => {
    if (req.user.userType == 'student'){
        User.getStudentResponses(req.user._id, function (err, data) {
            if (err) { return next(err); }
            // console.log('Categories: ' + JSON.stringify(data.categories));

            res.render('home', {
                title: 'Home',
                categories: data.categories
            });
        });

    }else{
        res.redirect('/staff');
    }

};


/**
 * GET /staff
 * Staff Home page.
 */
exports.staff = (req, res) => {
    User.getRespondents(function (err, users) {
        if (err) { return next(err); }

        res.render('staff/home', {
            title: 'Home',
            students: users
        });
    });


};

/**
 * GET /categories/:id?
 * Staff Home page.
 */
exports.getCategories = (req, res, next) => {
    if(req.params.id){
        console.log('id provided');
        Category.findById(req.params.id, function (err, category) {
            if (err) { return next(err); }
            console.log('id found');

            res.render('staff/category', {
                title: 'Category',
                category: category
            });
        })
    }else{
        Category.find({}, function (err, cats) {
            if (err) { return next(err); }
            res.render('staff/allCategories', {
                title: 'Categories',
                categories: cats
            });
        });
    }
};

/**
 * GET /responses/:id?
 * Show all students responses
 */
exports.getResponses = (req, res, next) => {
    if(req.params.id){

        User.getStudentResponses(req.params.id, function (err, responses) {
            if (err) { return next(err); }
            console.log(JSON.stringify(responses));
            res.render('staff/studentResponse', {
                title: 'Student Data',
                data: responses
            });
        });

    }else{
        User.findStudents(function (err, students) {
            if (err) { return next(err); }
            res.render('staff/students', {
                title: 'Student Responses',
                students: students
            });
        });
    }
};

/**
 * GET /categories/new
 * New Category Form.
 */
exports.getNewCategory = (req, res) => {
    res.render('staff/newCategory', {
        title: 'New Category'
    });
};

/**
 * GET /categories/:id/edit
 * Category edit form.
 */
exports.getEditCategory = (req, res) => {
    Category.findById(req.params.id,function (err, category) {
        if (err) { return next(err); }

        res.render('staff/editCategory', {
            title: 'Edit Category',
            category: category
        });
    });

};
/**
 * GET /categories/edit
 * Handles Category edit form.
 */
exports.postEditCategory = (req, res) => {

    res.redirect('/categories');
};


/**
 * POST /categories/new
 * Staff Home page.
 */
exports.postNewCategory = (req, res, next) => {
    // console.log(req.body);

    req.assert('cat_title', 'Category title cannot be blank').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/categories/new');
    }
    const fieldTitles = req.body.field_title;
    const fieldDescriptions = req.body.field_desc;
    const fieldTypes = req.body.field_type;
    // const fieldRequired = req.body.field_required;

    var fields = [];

    fieldTitles.forEach(function (title, index) {
        if(title){
            var humanReadableID = shortid.generate().toUpperCase();
            fields.push({fieldID: humanReadableID , title: title, description: fieldDescriptions[index], inputType:fieldTypes[index]});
        }
    });


    const category = new Category({
        title: req.body.cat_title,
        description: req.body.cat_desc,
        fields: fields
    });

    category.save((err) => {
        if (err) { return next(err); }

        User.getAllEmails(function (err, emails) {
            if (err) { return next(err); }
            Mailer.sendNewFieldsNotif(emails);
        });

        res.redirect('/categories');
    });
};


/**
 * GET /responses/download/:id
 * Download user data as csv.
 */
exports.getDownloadCSV = (req, res, next) => {
    if(req.params.id){
        User.getCsvReadyResponses(req.params.id, function (err, data) {
            if (err) { return next(err); }

            res.setHeader('Content-disposition', 'attachment; filename='+req.params.id+'.csv');
            res.csv(data,true);
        });
    }
};