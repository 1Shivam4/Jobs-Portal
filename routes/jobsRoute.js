const express = require('express');
const authController = require('../controllers/authController');
const jobController = require('../controllers/jobsController');

const router = express.Router();

router
  .route('/')
  .get(jobController.findAllJobs)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager', 'user'),
    jobController.uploadImage,
    jobController.resizeLogoPhoto,
    jobController.createJob
  );

router.route('/:id').get(jobController.findOneJob);
router
  .route('/updateJob/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager', 'user'),
    jobController.updateJob
  );

router
  .route('/deleteJob/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'manager', 'user'),
    jobController.deleteJob
  );

module.exports = router;
