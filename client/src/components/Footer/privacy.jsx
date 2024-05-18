import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <h1>Incoglingo Privacy Policy</h1>
      <p>
        At Incoglingo, we value the privacy and security of our users' personal information. This Privacy Policy outlines how we collect, use, disclose, and protect the information you provide when using our online language learning platform.
      </p>

      <div className="information-collected">
        <h2>Information We Collect</h2>
        <p>
          When you sign up for Incoglingo using your Google account, we collect the following information:
        </p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Profile picture (if provided by Google)</li>
        </ul>
        <p>
          Additionally, we may collect information about your usage of our platform, such as lesson history, preferences, and interactions with our services.
        </p>
      </div>

      <div className="purpose-of-use">
        <h2>Purpose of Use</h2>
        <p>
          The information we collect is used for the following purposes:
        </p>
        <ul>
          <li>To provide, maintain, and improve our language learning platform and services</li>
          <li>To communicate with you about your account, lessons, and updates</li>
          <li>To personalize your experience and provide relevant content and recommendations</li>
          <li>To comply with legal obligations and enforce our Terms of Service</li>
        </ul>
      </div>

      <div className="disclosure">
        <h2>Disclosure of Information</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following cases:
        </p>
        <ul>
          <li>To trusted service providers who assist us in operating our platform and providing services</li>
          <li>To comply with legal obligations, court orders, or governmental requests</li>
          <li>To enforce our Terms of Service or protect our rights, property, or safety</li>
        </ul>
      </div>

      <div className="security-practices">
        <h2>Security Practices</h2>
        <p>
          We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
        </p>
        <ul>
          <li>Encryption of sensitive data during transmission and storage</li>
          <li>Secure access controls and authentication procedures</li>
          <li>Regular security audits and vulnerability testing</li>
        </ul>
        <p>
          However, please note that no method of data transmission or storage is 100% secure, and we cannot guarantee absolute security of your information.
        </p>
      </div>

      <div className="updates">
        <h2>Updates to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated Privacy Policy will be effective upon posting on our website, and we encourage you to review it periodically.
        </p>
      </div>

      <div className="contact">
        <h2>Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at <a href="mailto:privacy@incoglingo.com">privacy@incoglingo.com</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;