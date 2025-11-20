const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Email templates directory
const templatesDir = path.join(__dirname, '../emailTemplates');

/**
 * Send interview email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name (without extension)
 * @param {Object} options.context - Data for template
 */
const sendInterviewEmail = async ({ to, subject, template, context }) => {
    try {
        // Read the template file
        const templatePath = path.join(templatesDir, `${template}.ejs`);
        const templateStr = fs.readFileSync(templatePath, 'utf-8');

        // Render the template with context
        const html = ejs.render(templateStr, context);

        // Send mail
        await transporter.sendMail({
            from: `"RecruitWay App" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
            to,
            subject,
            html
        });

        console.log(`Email sent to ${to} with template ${template}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = { sendInterviewEmail };