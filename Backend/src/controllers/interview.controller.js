const { PDFParse } = require('pdf-parse')
const { generateInterviewReportService, generateResumePdf }= require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')

/**
 * @name generateInterviewReport
 * @description controller to generate interview report based on user self description, resume and job description
*/

const generateInterviewReport = async (req, res) => {
    
    try{
        const resumeFile = req.file

        const { selfDescription, jobDescription } = req.body

        const parser = new PDFParse({
            data : resumeFile.buffer
        })

        const result = await parser.getText()

        const resumeContent = result.text

        await parser.destroy()

        const interviewReportByAi = await generateInterviewReportService({
            resume : resumeContent,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user : req.user.id,
            resume : resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        res.status(201).json({
            message : "Interview report generated successfully.",
            interviewReport
        })
    }catch(err){
        console.log('Interview report generation error', err)
        res.status(500).json({
            message : "Failed to generate interview report"
        })
    }

}    

/**
 * @name getReport
 * @description controller to get interview report by interviewId
*/

const getInterviewReport = async (req, res) => {
    
    const { interviewId } = req.params

    if(!interviewId){
        return res.status(400).json({
            message : "Interview Id not provided."
        })
    }

    const interviewReport = await interviewReportModel.findOne({ interviewId })

    if(!interviewReport){
        return res.status(400).json({
            message : "Interview report not found!"
        })
    }

    res.status(200).json({
        message : "Interview report fetched successfully!",
        interviewReport
    })

}

/**
 * @name getAllInterviewReports
 * @description controller to get all interview reports of a logged in user
*/

const getAllInterviewReports = async(req, res) => {

    const interviewReports = await interviewReportModel.find({user : req.user.id}).sort({createdAt : -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan") 

    res.status(200).json({
        message : "Interview reports fetched successfully.",
        interviewReports
    })
} 

/**
 * @name generateResumePdfController
 * @description controller to generate resume PDF based on user self description, resume and job description
*/

const generateResumePdfController= async (req, res) => {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message : "Interview report not found"
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type" : "application/pdf",
        "Content-Disposition" : `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterviewReport, getInterviewReport, getAllInterviewReports, generateResumePdfController }