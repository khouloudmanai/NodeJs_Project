const nodemailer = require("nodemailer");
 
 class EmailService {
   constructor(config) {
     this.config = config;
     this.transporter = nodemailer.createTransport(config);
   }
 
 
   async verifyConnection() {
     return new Promise((resolve) => {
       this.transporter.verify((error) => {
         if (error) {
           console.error("Email service connection error:", error);
           resolve(false);
         } else {
           console.log("✅ Email service is ready to send messages");
           resolve(true);
         }
       });
     });
   }
 
 
 
   async sendEmail(content) {
     try {
       if (!content.to) {
         throw new Error("No recipients defined");
       }
 
       const mailOptions = {
         from: this.config.auth.user, // Utilisation correcte du sender email
         ...content,
       };
 
       const info = await this.transporter.sendMail(mailOptions);
       console.log("✅ Email sent successfully:", info.messageId);
       return true;
     } catch (error) {
       console.error("❌ Failed to send email:", error);
       
       return false;
     }
   }
   async sendWelcomeEmail(to, username) {
     if (!to) {
       console.error("❌ No recipient email provided!");
       return false;
     }
 
     console.log(`📨 Sending welcome email to: ${to}`);
 
     const content = {
       to,
       subject: "Welcome ♥ ",
       html: `
         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
           <h2>Welcome, ${username}!</h2>
           <p>Thank you for joining our platform. We're excited to have you on board!</p>
           <p>If you have any questions, we will call you back.</p>
           <p>Best regards,
         </div>
       `,
     };
 
     return this.sendEmail(content);
   }
 }
 
 module.exports = EmailService;