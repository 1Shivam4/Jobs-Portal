const mongoose = require('mongoose');
const slugify = require('slugify');
const validate = require('validator');

const jobSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'Job should have a owner'],
    },

    jobTitle: {
      type: String,
      required: [true, 'A job must have a title'],
    },

    companyLogo: { type: String },
    jobType: { type: String, require: [true, 'Job must have a types'] },
    employer: {
      companyName: {
        type: String,
        required: [true, 'Job must belong to a company'],
      },
      companyEmail: {
        type: String,
        required: [true, 'There should be a company email.'],
      },
    },
    salaryRange: {
      type: String,
      default: 'Unpaid',
    },
    jobDescription: { type: String },
    resoponsibility: [String],
    requirements: [String],
    location: { type: String, required: [true, 'Please enter the location'] },
    applicationLink: {
      type: String,
      required: [true, 'Please give the application address'],
    },
    openDate: {
      type: Date,
      validate: {
        validator: function () {
          return this.openDate >= Date.now();
        },
        message: 'Date should be equal to or greater then the current date ',
      },
      required: [true, 'please provide the application apply opening date'],
    },
    closeDate: {
      type: Date,
      required: [true, 'Please tell the closing date of the application'],
    },
    postedDate: {
      type: Date,
      default: Date.now(),
    },
    slug: { type: String },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

jobSchema.pre('save', function (next) {
  const currentDate = new Date();

  if (currentDate >= this.closeDate) {
    this.status = false;
  } else {
    this.status = true;
  }
  next();
});

jobSchema.pre('save', function (next) {
  console.log(this.jobTitle);
  this.slug = slugify(this.jobTitle, { lower: true });
  next();
});
const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
