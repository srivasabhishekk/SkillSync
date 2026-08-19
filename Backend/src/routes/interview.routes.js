const express = require('express')
const interviewRouter = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const { generateInterviewReport, getInterviewReport, getAllInterviewReports, generateResumePdfController } = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')

/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @access private
 */

interviewRouter.post('/', authMiddleware.authUser, upload.single("resume"), generateInterviewReport)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */

interviewRouter.get('/report/:interviewId', authMiddleware.authUser, getInterviewReport)

/**
 * @route GET /api/interview/
 * @description get all interview reports of a logged in user
 * @access private
 */

interviewRouter.get('/', authMiddleware.authUser, getAllInterviewReports)

/**
 * @route POST /api/interview/resume/pdf
 * @description Generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, generateResumePdfController)

module.exports = interviewRouter