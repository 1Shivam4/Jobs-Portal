const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const allUsers = await User.find().select('-password').populate('jobs');

  res.status(200).json({
    status: 'success',
    users: { allUsers },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('jobs');

  if (!user) return next(new AppError(`User not found`, 404));

  res.status(200).json({
    status: 'success',
    users: { user },
  });
});
