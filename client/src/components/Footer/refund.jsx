import React from 'react';

const Refund = () => {
  return (
    <div className="Refund">
      <h1>Incoglingo Cancellation & Refund Policy</h1>
      

      <div className="refund-policy">
        <h2>Refund Policy</h2>
        <p>
          At Incoglingo, we strive to provide high-quality language learning experiences. However, if you are not satisfied with our services, you may be eligible for a refund under the following circumstances:
        </p>
        <ul>
          <li>
            If a scheduled lesson is canceled by the teacher with less than 24 hours' notice, you will be eligible for a full refund for that lesson.
          </li>
          <li>
            If you experience technical issues during a lesson that prevent you from participating effectively, you may request a partial refund or credit for that lesson, subject to our review.
          </li>
        </ul>
        <p>
          To request a refund, please contact our support team at <a href="mailto:kartikey.code@gmail.com">kartikey.code@gmail.com</a> with your refund request and relevant details.
        </p>
      </div>

      <div className="cancellation-policy">
        <h2>Cancellation Policy</h2>
        <p>
          If you wish to cancel your Incoglingo account or subscription, please follow these procedures:
        </p>
        <ol>
          <li>
            Log in to your Incoglingo account and navigate to the "Account Settings" section.
          </li>
          <li>
            Under the "Subscription" tab, click the "Cancel Subscription" button.
          </li>
          <li>
            Follow the prompts to confirm your cancellation.
          </li>
          <li>
            Your subscription will remain active until the end of your current billing cycle, after which it will be canceled, and you will no longer be charged.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Refund;