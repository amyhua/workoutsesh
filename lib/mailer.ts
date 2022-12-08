import nodemailer from 'nodemailer';

async function setupMailer({
  email
}: {
  email: string
}) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.email",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
  
  const info = await transporter.sendMail({
    from: '"Workout Sesh 👻" <workoutseshinbox@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Verify your email account with Workout Sesh", // Subject line
    text: `Click on the link below to verify your email on Workout Sesh:
    

    `, // plain text body
    html: `<h3>Verify your Workout Sesh email.</h3>
    <p class="margin-bottom: 10px;">
      Copy + Paste or click on this URL to verify your email:
    </p>
    <p class="margin-bottom: 10px;">
      
    </p>
    `, // html body
  });

}  

