const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-email-password", // Replace with your email password or app password
  },
});

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Cloud Function to send OTP
exports.sendOTP = functions.https.onRequest(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required!" });
  }

  const otp = generateOTP();
  const expirationTime = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  try {
    // Store OTP in Firestore
    await db.collection("otps").doc(email).set({ otp, expiresAt: expirationTime });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp} (valid for 5 minutes)`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
});

// Cloud Function to verify OTP
exports.verifyOTP = functions.https.onRequest(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required!" });
  }

  try {
    const otpDoc = await db.collection("otps").doc(email).get();
    if (!otpDoc.exists) {
      return res.status(400).json({ error: "Invalid or expired OTP!" });
    }

    const { otp: storedOTP, expiresAt } = otpDoc.data();
    if (Date.now() > expiresAt) {
      return res.status(400).json({ error: "OTP expired!" });
    }

    if (otp !== storedOTP) {
      return res.status(400).json({ error: "Invalid OTP!" });
    }

    // OTP is valid, delete it after verification
    await db.collection("otps").doc(email).delete();

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify OTP", details: error.message });
  }
});
