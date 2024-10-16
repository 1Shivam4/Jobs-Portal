const fs = require('fs');
const path = require('path');
const multer = require('multer');

const sharp = require('sharp');
const cron = require('node-cron');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Job = require('../models/jobModel');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImage = upload.single('companyLogo');

exports.resizeLogoPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `logo-${req.user.id}-${Date.now()}.jpeg`;

  const logoDir = path.join(__dirname, '../public/imgs/logo');

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(logoDir, req.file.filename)); // Correct file path

  next();
});

// Real time status change
const scheduler = cron.schedule('0 * * * *', async () => {
  try {
    const currentDate = new Date();
    await Job.updateMany(
      {
        openDate: { $lte: currentDate },
        closeDate: { $gte: currentDate },
      },
      { status: true }
    );

    await Job.updateMany(
      {
        closeDate: { $lt: currentDate },
      },
      { status: false }
    );
  } catch (error) {
    console.log('Everything is upto date');
  }
});

scheduler.start();

exports.findOneJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError('Job not found', 404));
  }
  res.status(200).json({ status: 'success', data: job });
});

exports.findAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find();

  if (!jobs) {
    return next(new AppError('Jobs not found', 404));
  }

  res.status(200).json({ status: 'success', data: jobs });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create({ owner: req.user._id, ...req.body });

  res.status(200).json({ status: 'success', data: newJob });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError("Job doesn't exists", 404));
  }
  let updatedJob = '';
  if (req.user._id.toString() === job.owner.toString()) {
    updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  } else {
    return next(new AppError('You are not the owner of this job', 401));
  }

  res.status(200).json({
    status: 'Updated',
    data: { updatedJob },
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError("Job doesn't exists", 404));
  }
  let updatedJob = '';
  if (req.user._id.toString() === job.owner.toString()) {
    updatedJob = await Job.findByIdAndDelete(req.params.id);
  } else {
    return next(new AppError('You are not the owner of this job', 401));
  }

  res.status(200).json({
    status: 'Successfully Deleted Job.',
  });
});
