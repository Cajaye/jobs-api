const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/index')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userID }).sort('creadtedAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
    const { user: { userID }, params: { id: jobID } } = req;
    const job = await Job.findOne({ createdBy: userID, _id: jobID })
    if (!job) {
        throw new NotFoundError(`No job with the id of ${jobID}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userID
    const job = await Job.create({ ...req.body })
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
    const { user: { userID }, params: { id: jobID }, body: { company, position } } = req;
    if (company === '' || position === '') {
        throw new BadRequestError('Please provide values for both company and position')
    }
    const job = await Job.findOneAndUpdate({ createdBy: userID, _id: jobID }, req.body, {
        runValidators: true,
        new: true
    })
    if (!job) {
        throw new NotFoundError(`No job with the id of ${jobID}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    const { user: { userID }, params: { id: jobID } } = req;
    const job = await Job.findOneAndRemove({ createdBy: userID, _id: jobID })
    if (!job) {
        throw new NotFoundError(`No job with the id of ${jobID}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'Job was successfully deleted' })
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }