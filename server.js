import express from "express";
import fetch from "node-fetch"; // si Node >= 18 tu peux utiliser global fetch

const app = express();
const PORT = 3001;

// Express n'a plus besoin de CORS, Nginx gère ça
app.use(express.json());

// Test
app.get("/api/test", (req, res) => {
  res.json({ message: "Serveur Express OK" });
});

// Proxy vers le script PHP
app.get("/api/change-account", async (req, res) => {
  const { imei, compte } = req.query;

  try {
    const url = `http://192.227.91.57/services/changeAccount.php?imei=${imei}&compte=${compte}`;
    const response = await fetch(url);
    const result = await response.text();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur backend");
  }
});

// Écoute uniquement sur localhost
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend Express OK sur http://127.0.0.1:${PORT}`);
});







// import express from 'express';
// import cors from 'cors';
// import nodemailer from 'nodemailer';
// // import dotenv from 'dotenv';

// // dotenv.config();

// const app = express();
// const PORT = 3001;

// app.use(cors());
// app.use(express.json());

// app.post('/send-email', async (req, res) => {
//   const { to, subject, text } = req.body;

//   try {
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     await transporter.sendMail({
//       from: `"Octagon" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text
//     });

//     res.status(200).send({ message: 'Email sent successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: 'Failed to send email' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
