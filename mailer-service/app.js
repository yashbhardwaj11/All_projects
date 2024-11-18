const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const axios = require('axios');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'technowebofficial01@gmail.com',
    pass: 'gkcftqyqwmcvivnh'
  }
});

app.post('/apply', (req, res) => {
  const { email } = req.body;

  // First email: Application Submission Confirmation
  const applicationMailOptions = {
    from: 'technowebofficial01@gmail.com',
    to: email,
    subject: 'Application Submitted Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Thank you for your application!</h2>
        <p>Dear Applicant,</p>
        <p>Thank you for applying to the job position. We have successfully received your application. Our team will review it and get back to you shortly with further updates.</p>
        <p style="color: #555;">Best regards,<br>Your Recruitment Team</p>
        <footer style="font-size: 12px; color: #888;">
          <p>If you have any questions, feel free to contact us at <a href="mailto:technowebofficial01@gmail.com">technowebofficial01@gmail.com</a>.</p>
        </footer>
      </div>`
  };

  // Second email: Profile Shortlisted for Online Assessment
  const shortlistedMailOptions = {
    from: 'technowebofficial01@gmail.com',
    to: email,
    subject: 'Profile Shortlisted – Online Assessment Invitation',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Congratulations! Your Profile Has Been Shortlisted</h2>
        <p>Dear Applicant,</p>
        <p>We are pleased to inform you that your profile has been shortlisted for the next stage in our recruitment process. As the next step, you are invited to complete an online assessment round.</p>
        <p style="color: #555;">Please click the link below to start the online assessment:</p>
        <p><strong>Online Assessment Link:</strong> <a href="http://localhost:3001/" target="_blank" style="color: #007BFF;">Start Assessment</a></p>
        <p style="color: #555;">The assessment is designed to evaluate your skills and capabilities, and it is a critical part of our selection process.</p>
        <p style="color: #555;">Please ensure that you complete the assessment within the given time frame. If you have any issues or questions, feel free to reach out to us.</p>
        <p style="color: #555;">Best of luck with the assessment!</p>
        <footer style="font-size: 12px; color: #888;">
          <p>If you have any questions, feel free to contact us at <a href="mailto:technowebofficial01@gmail.com">technowebofficial01@gmail.com</a>.</p>
        </footer>
      </div>`
  };

  // Send application confirmation email
  transporter.sendMail(applicationMailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending application confirmation email');
    }

    // Send shortlisted email after the application email is successfully sent
    transporter.sendMail(shortlistedMailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending shortlisted email');
      }
      res.status(200).send('Application and shortlisted emails sent successfully');
    });
  });
});


app.post('/qa-pass', (req, res) => {
  const { email, meetingLink, roomId } = req.body;

  const mailOptions = {
    from: 'technowebofficial01@gmail.com',
    to: email,
    subject: 'Congratulations! You Passed the QA Round',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Congratulations!</h2>
        <p>Dear Applicant,</p>
        <p>We are pleased to inform you that you have successfully passed the QA round. You are now moving to the next stage of the interview process.</p>
        <p style="color: #555;">The interview will be scheduled soon. Meanwhile, please use the following details to join the meeting:</p>
        <p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
        <p><strong>Room ID:</strong> ${roomId}</p>
        <p style="color: #555;">Good luck, and we look forward to seeing you in the next round!</p>
        <footer style="font-size: 12px; color: #888;">
          <p>If you have any questions, feel free to contact us at <a href="mailto:technowebofficial01@gmail.com">technowebofficial01@gmail.com</a>.</p>
        </footer>
      </div>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('QA pass email sent successfully');
  });
});

app.post('/final-round-pass', (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: 'technowebofficial01@gmail.com',
    to: email,
    subject: 'Congratulations! You Have Cleared All Rounds',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">You’ve Cleared All Rounds!</h2>
        <p>Dear Applicant,</p>
        <p>Thank you for taking part in our interview process. We are thrilled to inform you that you have successfully cleared all rounds. Congratulations!</p>
        <p>We will notify you soon about the offer letter process. Stay tuned, and we hope to welcome you to the team soon!</p>
        <p style="color: #555;">Best regards,<br>Your Recruitment Team</p>
        <footer style="font-size: 12px; color: #888;">
          <p>If you have any questions, feel free to contact us at <a href="mailto:technowebofficial01@gmail.com">technowebofficial01@gmail.com</a>.</p>
        </footer>
      </div>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Final round pass email sent successfully');
  });
});

app.get('/congratulations/:email', (req, res) => {
  const { email } = req.params;

  axios.post('http://localhost:3002/final-round-pass', { email })
    .then(response => {
      res.status(200).send(response.data);
    })
    .catch(error => {
      res.status(500).send('Error in sending email');
    });
});

app.post('/not-moving-forward', (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: 'technowebofficial01@gmail.com',
    to: email,
    subject: 'Thank You for Your Application',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #FF6347;">Thank you for your application</h2>
        <p>Dear Applicant,</p>
        <p>Thank you for your time and effort in the interview process. Unfortunately, we will not be moving forward with your application. We truly appreciate the opportunity to get to know you better.</p>
        <p>We wish you the best in your future endeavors and hope you continue to pursue your career with enthusiasm and determination.</p>
        <p style="color: #555;">Best regards,<br>Your Recruitment Team</p>
        <footer style="font-size: 12px; color: #888;">
          <p>If you have any questions, feel free to contact us at <a href="mailto:technowebofficial01@gmail.com">technowebofficial01@gmail.com</a>.</p>
        </footer>
      </div>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Not moving forward email sent successfully');
  });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
