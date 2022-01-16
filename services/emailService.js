'use strict';

const { Buffer } = require('buffer');
const path = require('path');
const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

const options = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: '/views/emails/',
        layoutsDir: '',
        defaultLayout: '',
    },
    viewPath: path.join(__dirname, '../views/emails/')
};

let transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 465,
    secure: true, // true for 465, false for other ports,
    pool: true,
    rateLimit: 20,
    auth: {
        user: process.env.AWS_SES_USER,
        pass: process.env.AWS_SES_PASS
    }
});
transporter.use('compile', hbs(options));

const BASE_URL = process.env.BASE_URL;
const SENT_FROM = 'noreply@investnfarm.com';

const sendMail = (to, subject, template, data) => {
    let mailOptions = {
        from: '"Invest\'N\'Farm" <' + SENT_FROM + '>',
        to: to,
        subject: subject,
        template: template,
        context: data
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        // console.log('Message sent: %s', info.messageId);
    });
}

module.exports = {
    sendConfirmationEmail: function (user) {
        const email_b64 = Buffer.from(user.email).toString('base64');
        const crypto = require('crypto');
        const hash = crypto.createHash('md5').update(user.email + 'okirikwenEE129Okpkenakai').digest('hex');

        const data = {
            user: user.fullname,
            url: encodeURI(BASE_URL + 'activate/' + email_b64 + '/' + hash),
            base_url: encodeURI(BASE_URL)
        };
        const subject = "Verify your email address";
        const template = 'verifyAccount';
        sendMail(user.email, subject, template, data);
    },
}