const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// Route to handle form submissions from React frontend
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  // Compose the email to be sent
  const mailOptions = {
    from: process.env.EMAIL, // Sender address
    to: email,                   // List of receivers
    subject: 'Thank you for your submission', // Subject line
    text: `Dear ${name},\n\nThank you for your message: "${message}". We will get back to you soon.\n\nBest regards,\nYour Company` // Plain text body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.get('/test', (req, res) => {
    res.send('OK!')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;