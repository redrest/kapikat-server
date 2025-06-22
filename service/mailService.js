require('dotenv').config();
const nodemailer = require("nodemailer");

class mailService {
    constructor(transporter) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

    async sendActivationMail(to, code) {
        await this.transporter.sendMail({
            from: `"Kapikat" <${process.env.SMTP_USER}>`,
            to,
            subject:'Подтверждение аккаунта на Kapikat',
            text: `Ваш код подтверждения: ${code}`,
            html:
                `
                    <div>
                        <h1>Ваш код подтверждения</h1>
                        <span>${code}</span>
                    </div>
                `
        })
    }
    async sendVerificationCode(to, code) {
        await this.transporter.sendMail({
            from: `"Kapikat" <${process.env.SMTP_USER}>`,
            to,
            subject:'Код подтверждения для смены пароля',
            text: `Ваш код подтверждения: ${code}`,
            html:
                `
                    <div>
                        <h1>Ваш код подтверждения</h1>
                        <span>${code}</span>
                    </div>
                `
        })
    }
}

module.exports = new mailService();
