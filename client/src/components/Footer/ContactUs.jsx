import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="contact-us-section">
      <h1>Contact Us</h1>
      <p>
        We're here to help! If you have any questions, concerns, or feedback, please don't hesitate to reach out to us using the information below.
      </p>

      <div className="contact-details">
        <h2>Get in Touch</h2>
        <p><strong>Registered Company Address:</strong></p>
        <p>
          Incoglingo<br />
          
          SA 17/144-79, AGRASEN NAGAR, PAHARIYA<br />
          Varanasi, Uttar Pradesh<br />
          India 221007
        </p>

        <p><strong>Phone Number:</strong></p>
        <p>+91 9123520131</p>

        <p><strong>Email:</strong></p>
        <p><a href="mailto:kartikey.code@gmail.com">kartikey.code@gmail.com</a></p>
      </div>

      <div className="contact-form">
        <h2><a target="_blank" rel="noopener noreferrer" href='https://forms.gle/fRJT2sxQfMQ3P61y9'>Click here to send a message</a></h2>
      </div>
    </div>
  );
};

export default ContactUsPage;