import nodemailer from 'nodemailer'
import handlebars  from 'handlebars'
import fs from 'fs'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const sendEmail = async (email, subject, payload, template ) => {
    try {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        service: 'Outlook365',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
        },
      });

      const source = template ? fs.readFileSync(path.join(__dirname, 'template', template), "utf8") : ''
      const compiledTemplate = handlebars.compile(source);
      const options = () => {
        return {
          from: 'Consist- do not replay <divur@consist.co.il>',
          to: email,
          subject: subject + ' - do not replay',
          html: payload ? compiledTemplate(payload): "",
        //   attachments: attachment ? [{   // binary buffer as an attachment
        //     filename: 'consist-divur-report.xlsx',
        //     content: attachment
        // }]: [],
        };
      };
  
      // Send email
      transporter.sendMail(options(), (error, info) => {
        if (error) {
          console.log(error);
          return error;
        } else {
          return {success: true};
        }
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  };