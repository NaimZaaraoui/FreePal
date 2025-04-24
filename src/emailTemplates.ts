export const registrationEmailTemplate = (userName: string, confirmationLink: string) => `
  <html>
    <body>
      <h1>Welcome to Our Service, ${userName}!</h1>
      <p>Thank you for registering. Please confirm your email address by clicking the link below:</p>
      <p><a href="${confirmationLink}">Confirm your email</a></p>
      <p>If you did not register, please ignore this email.</p>
      <br/>
      <p>Best regards,<br/>The Team</p>
    </body>
  </html>
`;

export const inviteEmailTemplate = (inviterName: string, inviteLink: string) => `
  <html>
    <body>
      <h1>You have been invited by ${inviterName}!</h1>
      <p>Click the link below to join:</p>
      <p><a href="${inviteLink}">Accept Invitation</a></p>
      <p>We look forward to having you with us.</p>
      <br/>
      <p>Best regards,<br/>The Team</p>
    </body>
  </html>
`;

export const welcomeEmailTemplate = (userName: string) => `
  <html>
    <body>
      <h1>Welcome aboard, ${userName}!</h1>
      <p>We're excited to have you with us. Explore and enjoy our service.</p>
      <br/>
      <p>Best regards,<br/>The Team</p>
    </body>
  </html>
`;
