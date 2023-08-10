const mongoose = require('mongoose')
const Schema = mongoose.Schema
const JobSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter your full name'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please provide a description'],
    },
    type: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    shift: {
      type: String,
      enum: ['day', 'night'],
      default: 'day',
    },
  },
  { timestamps: true },
)

const Job = mongoose.model('Job', JobSchema)
module.exports = Job
