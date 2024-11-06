const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const jwtExpiresInDays = parseInt(process.env.JWT_EXPIRES_IN, 10);

  const cookieOptions = {
    expires: new Date(Date.now() + jwtExpiresInDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, phone, email, password, confirmPassword, role } = req.body;

  const existingUser = await User.findOne({ phone: phone });

  if (existingUser) {
    return next(new AppError(`User already exists`, 403));
  }

  const newUser = await User.create({
    name: name,
    phone: phone,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    role: role,
  });

  createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password)
    return next(new AppError('All fields are required', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`Incorrect number or Password`, 401));
  }

  console.log(user);
  createSendToken(user, 200, res);
});

// exports.protect = catchAsync(async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return next(
//       new AppError('You are not logged in! Please log in to access', 401)
//     );
//   }

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    return next(
      new AppError('User belonging to this token does not exist', 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decode.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decode.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      console.log('User is logged in:', res.locals.user); // Add this line
      return next();
    } catch (err) {
      return next();
    }
  }
  return next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this', 403)
      );
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ phone: req.body.phone });

  if (!user) {
    return next(
      new AppError(
        'This number doesn"t belongs to any user. Please check it again',
        404
      )
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}//${req.get(
    'host'
  )}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Your reset Token. \n\nForget your password? Go to ${resetUrl} from restro to reset your password. Valid for 10 minutes. Please don't share your otp with anyone.`;

  res.status(200).json({
    message,
  });

  // SENDING SMS USIGN TWILIO
  // try {
  //   await createMessage(message, '+91' + req.body.phone);

  //   res.status(200).json({
  //     status: 'success',
  //     message: 'Token is send to your registered phone number.',
  //   });
  // } catch (err) {
  //   user.passwordResetToken = undefined;
  //   user.resetPasswordExpires = undefined;

  //   await user.save({ validateBeforeSave: false });

  //   return next(
  //     new AppError(
  //       'There is an error sending the sms, Please try again later',
  //       500
  //     )
  //   );
  // }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // Short expiration time
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
