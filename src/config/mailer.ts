import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

const mailer = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

mailer.use('compile', hbs({

  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/resources/views/mails/'),
    defaultLayout: false,
  },

  viewPath: path.resolve('./src/resources/views/mails/'),
  extName: '.html',

}));

export default mailer;
