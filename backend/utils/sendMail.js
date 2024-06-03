//Nodemailer Code
import nodemailer from 'nodemailer';

// var message = "My first Message from Nodemailer"
// var toEmail = "rowdyravish123@gmail.com"

export const sendMail = async (toEmail, subject, message) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });


    const mailOptions = {
        from: process.env.EMAIL_NAME, // sender address
        to: toEmail, // list of receivers
        subject: subject, // Subject line
        html: message // plain text body
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        return { status: true, msg: "Mail sent successfully", info };
    } catch (err) {
        if (err.responseCode === 550) {
            // Custom handling for invalid email address
            return { status: false, msg: "Invalid email address" };
        }
        return { status: false, msg: err.message };
    }
}