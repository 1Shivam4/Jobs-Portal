const cron = require('node-cron');
const Job = require('../models/jobModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const scheduler = cron.schedule('* * * * *', async () => {
  try {
    const currentDate = new Date();

    const jobs = await Job.find();
    jobs.forEach((job) => {
      console
        .log
        // `Job ${job._id}: openDate = ${job.openDate}, closeDate = ${job.closeDate}`
        ();
    });

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
    console.error('Error updating job status:', error);
  }
});

exports.home = catchAsync(async (req, res, next) => {
  const allJobs = await Job.find();
  const jobs = await Job.find({ status: true }).sort({ createdAt: -1 });
  console.log(allJobs.length);
  res.status(200).render('index.ejs', {
    jobs: jobs,
    user: res.locals.user,
    available: jobs.length,
    total: allJobs.length,
  });
});

exports.login = (req, res, next) => {
  res.status(200).render('login.ejs', { user: res.locals.user });
};
exports.about = (req, res, next) => {
  res.status(200).render('about.ejs', { user: res.locals.user });
};

exports.jobs = (req, res, next) => {
  res.status(200).render('jobs.ejs', { user: res.locals.user });
};

exports.createJob = (req, res, next) => {
  res.status(200).render('createJob.ejs', { user: res.locals.user });
};
