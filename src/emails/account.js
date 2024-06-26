const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mdhasan9.sy@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'u1704118@student.cuet.ac.bd',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. Let us know what can we do for you.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}