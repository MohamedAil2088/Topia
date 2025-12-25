const nodemailer = require('nodemailer');

// Cache Ethereal account to avoid creating new one each time
let etherealAccount = null;

const sendEmail = async (options) => {
    let transporter;

    // Check if SMTP vars are set, otherwise use Ethereal (Test)
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        try {
            transporter = nodemailer.createTransport({
                service: process.env.SMTP_SERVICE || 'gmail',
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD
                }
            });
        } catch (error) {
            console.error('SMTP Configuration Error:', error.message);
            throw new Error('Email configuration is invalid');
        }
    } else {
        // Create or reuse Ethereal Test Account
        try {
            if (!etherealAccount) {
                console.log('⚠️  Creating Ethereal Email test account...');
                etherealAccount = await nodemailer.createTestAccount();
                console.log('✅ Ethereal account created successfully');
            }

            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: etherealAccount.user,
                    pass: etherealAccount.pass,
                },
            });
            console.log('⚠️  Using Ethereal Email (Dev Mode) because SMTP env vars are missing.');
        } catch (error) {
            console.error('Ethereal Email Error:', error.message);
            throw new Error('Could not create test email account');
        }
    }

    // Define email options
    const mailOptions = {
        from: `"${process.env.FROM_NAME || 'Topia Store'}" <${process.env.FROM_EMAIL || 'no-reply@topia.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    try {
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Message sent: %s", info.messageId);

        // If using Ethereal, log the preview URL
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log("📨 Preview URL: %s", previewUrl);
            console.log("👆 Open this link to see the email!");
        }

        return info;
    } catch (error) {
        console.error('Email Send Error:', error.message);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
