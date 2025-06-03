const nodemailer = require("nodemailer");
const validator = require("validator");

const sendMail = (req, res) => {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
        return res.status(400).json({ message: "Missing required fields: to, subject, html" });
    }

    if (!validator.isEmail(to)) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Error sending email", error: error.message });
        }
        res.status(200).json({ message: "Mail sent successfully", info });
    });
};

module.exports = { sendMail };