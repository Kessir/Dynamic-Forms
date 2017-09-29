const express = require('express');
const router = express.Router();
const path = require('path');

const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../uploads') });

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('../config/passport');

/**
 * Controllers (route handlers).
 */
const homeController = require('../controllers/home');
const staffController = require('../controllers/staff');
const userController = require('../controllers/user');
const apiController = require('../controllers/api');
// const contactController = require('./controllers/contact');


/**
 * Primary app routes.
 */
router.get('/', passportConfig.isAuthenticated, staffController.index);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.logout);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
// app.get('/contact', contactController.getContact);
// app.post('/contact', contactController.postContact);
router.get('/account', passportConfig.isAuthenticated, userController.getAccount);
router.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
router.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
router.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
router.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

router.get('/staff', passportConfig.isStaff, staffController.staff);

router.post('/responses/new', passportConfig.isStaff, homeController.postResponse);
router.get('/responses/download/:id', passportConfig.isStaff, staffController.getDownloadCSV);
router.get('/responses/:id?', passportConfig.isStaff, staffController.getResponses);

// router.get('/fields/new', passportConfig.isAuthenticated, staffController.getNewField);
// router.post('/fields/new', passportConfig.isAuthenticated, staffController.postNewField);

router.get('/categories/new', passportConfig.isStaff, staffController.getNewCategory);
router.post('/categories/new', passportConfig.isStaff, staffController.postNewCategory);
router.get('/categories/:id/edit', passportConfig.isStaff, staffController.getEditCategory);
router.post('/categories/edit', passportConfig.isStaff, staffController.postEditCategory);
router.get('/categories/:id?', passportConfig.isStaff, staffController.getCategories);



/**
 * API examples routes.
 */
router.get('/api', apiController.getApi);
router.get('/api/upload', apiController.getFileUpload);
router.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);


module.exports = router;