
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("process.env.EMAIL_USER 11", process.env.EMAIL_USER)
  console.log("process.env.EMAIL_PASS 11", process.env.EMAIL_PASS)
});


app.get("/api/test", (req, res) => {
  console.log("Route test OK !");
  res.json({ message: "Serveur Express OK" });
});

app.get("/api/test2", (req, res) => {
  console.log("Route test OK 222 !");
  res.json({ message: "Serveur Express OK 222" });
});



app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;


  console.log("process.env.EMAIL_USER 22", process.env.EMAIL_USER)
  console.log("process.env.EMAIL_PASS 22", process.env.EMAIL_PASS)

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Octagon" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    res.status(200).send({ message: 'Email sent successfully' });
  } catch (err) {
    console.error("❌ Nodemailer ERROR:", err);  // <-- log complet
    res.status(500).send({ error: 'Failed to send email', details: err.toString() });
  }
});



app.get("/api/change-account", async (req, res) => {
  const { imei, compte } = req.query;
  try {
    const url = `http://192.227.91.57/services/changeAccount.php?imei=${imei}&compte=${compte}`;
    const response = await fetch(url);
    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur backend");
  }
});
