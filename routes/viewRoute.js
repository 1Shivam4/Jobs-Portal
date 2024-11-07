const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewsController');

const route = express.Router();

route.use(authController.isLoggedIn);

route.get('/', authController.isLoggedIn, viewController.home);
route.get('/about', authController.isLoggedIn, viewController.about);
route.get('/count', authController.isLoggedIn, viewController.count);

route.route('/login').get(authController.isLoggedIn, viewController.login);
route.route('/createJob').get(authController.protect, viewController.createJob);

module.exports = route;
