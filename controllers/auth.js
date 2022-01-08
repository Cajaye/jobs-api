const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors/index')
const bcrypt = require('bcryptjs')

const matchPassword = async (enteredpassword, oldPassword) => {
    return await bcrypt.compare(enteredpassword, oldPassword)
}

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED)
        .json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password.')
    }

    const user = await User.findOne({ email: email })
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials.')
    }
    //compare password
    const comparePasswords = await matchPassword(password, user.password)
    if (!comparePasswords) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }