const nodemailer = require('nodemailer');

//for testing purpose use https://ethereal.email/ and check the "Messages" section to see sent emails
//for prod configure your gmail
function sendEmail(body) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'reyna5@ethereal.email',
            pass: 'ups7KxM5JUrCfa7bGm'
        }
    });

    const mailOptions = {
        from: 'me@mail.com',
        to: 'you@mail.com',
        subject: 'Here are today\'s prices',
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendEmail }