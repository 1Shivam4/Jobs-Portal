const whitlist = ['https://www.google.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitlist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by cors'));
    }
  },
};

module.exports = corsOptions;
