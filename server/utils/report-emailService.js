// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: process.env.EMAIL_SERVICE || 'Gmail',
//     host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//     port: process.env.EMAIL_PORT || 587,
//     secure: false, // true for 465, false for others
//     auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// /**
//  * Send interview report email
//  * @param {Object} options
//  * @param {string} options.to - Recipient email
//  * @param {string} options.subject - Email subject
//  * @param {Buffer} [options.attachment] - Optional PDF buffer to attach
//  * @param {string} [options.filename] - Filename for attachment
//  */
// const sendReportEmail = async ({ to, subject, attachment, filename, message }) => {
//     try {
//         const mailOptions = {
//             from: `"RecruitWay App" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
//             to,
//             subject,
//             // Include optional text message above PDF content
//             html: `<p>${message || 'Please find your interview report attached.'}</p>`,
//         };

//         if (attachment && filename) {
//             mailOptions.attachments = [{ filename, content: attachment }];
//         }

//         await transporter.sendMail(mailOptions);
//         console.log(`Report Email successfully sent to ${to}`);
//     } catch (error) {
//         // console.error('Error sending email:', error);
//         throw new Error('Failed to send email');
//     }
// };

// module.exports = { sendReportEmail };





const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false otherwise
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Send interview report email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {Buffer} [options.attachment] - Optional PDF buffer to attach
 * @param {string} [options.filename] - Filename for attachment
 * @param {string} [options.message] - Optional HTML message
 */
const sendReportEmail = async ({ to, subject, attachment, filename, message }) => {
    try {
        const mailOptions = {
            from: `"RecruitWay App" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
            to,
            subject,
            text: message || 'Please find your interview report attached.', // fallback for non-HTML clients
            html: `<p>${message || 'Please find your interview report attached.'}</p>`,
        };

        if (attachment && filename) {
            mailOptions.attachments = [
                {
                    filename,
                    content: attachment,
                },
            ];
        }

        const info = await transporter.sendMail(mailOptions);
        console.log(`Report email successfully sent to ${to}. Message ID: ${info.messageId}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = { sendReportEmail };

