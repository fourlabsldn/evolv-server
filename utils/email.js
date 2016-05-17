const nodemailer = require('nodemailer');

const smtpConfig = {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'evolv-mail',
    pass: 'b5jkvsQqSncm'
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
  mailOptions.from = mailOptions.from || 'noreply@delivery.evolv.london';

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
