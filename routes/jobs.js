const express = require('express');
const Router = express.Router();

const { getAllJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs')

Router.route('/').get(getAllJobs).post(createJob)
Router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

module.exports = Router;