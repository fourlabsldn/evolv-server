const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');

const smtpConfig = {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

// create reusable transporter object
const transporter = nodemailer.createTransport(smtpConfig);

/**
 * Sends an email using evolv's standard email account.
 * @method sendMail
 * @param  {Object} mailOptions
 * @param {String}  mailOptions.from - Sender address like '"Fred Foo 👥" <foo@blurdybloop.com>'
 * @param {String}  mailOptions.to - Comma separated list of receivers
 * @param {String}  mailOptions.subject - Subject line
 * @param {String}  mailOptions.text - Plain text body
 * @param {String}  mailOptions.html - Html body
 * @return {Promise}
 */
function send(mailOptions) {
  mailOptions.from = mailOptions.from || '"Evolv" <noreply@delivery.evolv.london>';

  // Clean all option strings to prevent XSS attacks

  mailOptions.html = typeof mailOptions.html === 'string'
    ? sanitizeHtml(mailOptions.html)
    : undefined;

  return new Promise((resolve, reject) => {
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`----- Error sending email to ${mailOptions.to}. -----`);
        reject(error);
      } else {
        console.log(`----- Email successfully sent to ${mailOptions.to}. -----`);
        resolve(info);
      }
      return;
    });
  });
}

const email = { send };
module.exports = email;
