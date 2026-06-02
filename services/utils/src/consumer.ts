import { Kafka } from "kafkajs";
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const startSendMailConsumer = async() =>{
    try {
        const kafka = new Kafka({
            clientId: "mail-service",
            brokers: [process.env.KAFKA_BROKER ||'localhost:9092'],
        });

        const consumer = kafka.consumer({groupId: "mail-service-group"});

        await consumer.connect();

        const topicName = "send-mail"

        await consumer.subscribe({topic : topicName, fromBeginning: false})

        console.log("Mail service consumer started, listening for sending mail ✅")

        await consumer.run({
            eachMessage: async({topic, partition, message})=>{
                try {
                    const {to, subject, html} = JSON.parse(message.value?.toString() || "{}");

                    const tarnsporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth:{
                            user: process.env.EMAIL,
                            pass: process.env.EMAIL_PASSWORD,
                        }
                    })

                    await tarnsporter.sendMail({
                        from: "HireNest <no-reply>",
                        to,
                        subject,
                        html,
                    })

                    console.log(`Mail has been sent to ${to} ✅`)
                } catch (error) {
                    console.log("Fail to send mail❌", error)
                }
            }
        })

    } catch (error) {
        console.log("Failed to start kafka consumer❌", error)
    }
}