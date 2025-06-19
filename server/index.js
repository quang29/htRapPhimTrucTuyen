// index.js
const express = require("express");
const cors = require("cors");
const { VNPay } = require("vnpay");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
const PORT = 3001;

// Firebase config
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// VNPay config
const vnpay = new VNPay({
  tmnCode: "23O57E53",
  secureSecret: "BHACCSKL7408SY1B7BYNFELB6B73PO8C",
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: "SHA512",
  enableLog: true,
});

// 🔹 Route 1: Tạo thanh toán
app.post("/create-payment", async (req, res) => {
  try {
    let { amount, orderId, userId } = req.body;
    console.log("✅ Amount from frontend:", amount);
    amount = Number(amount);

    if (isNaN(amount)) {
      console.error("❌ Invalid amount:", amount);
      return res.status(400).json({ error: "Invalid amount" });
    }

    console.log({
      vnp_Amount: amount.toString(),
      vnp_TxnRef: orderId || `order_${Date.now()}`,
      vnp_OrderInfo: `Thanh toan phim cho User ${userId}`,
      vnp_ReturnUrl: `http://localhost:5173/payment-success`, // ✅ FE sẽ xử lý query tại đây
      vnp_IpnUrl: "https://cc6d-42-113-105-132.ngrok-free.app/vnpay-ipn", // ✅ IPN sẽ gửi dữ liệu về đây
      vnp_IpAddr: "127.0.0.1",
      vnp_OrderType: "other",
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
    });

    const paymentUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: amount.toString(),
      vnp_TxnRef: orderId || `order_${Date.now()}`,
      vnp_OrderInfo: `Thanh toan phim cho User ${userId}`,
      vnp_ReturnUrl: `http://localhost:5173/payment-success`, // ✅ FE sẽ xử lý query tại đây
      // vnp_IpnUrl: "https://cc6d-42-113-105-132.ngrok-free.app/vnpay-ipn", // ✅ IPN sẽ gửi dữ liệu về đây
      vnp_IpAddr: "127.0.0.1",
      vnp_OrderType: "other",
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
    });

    console.log("🔗 Redirect to:", paymentUrl);
    res.json({ url: paymentUrl });
  } catch (error) {
    console.error("❌ VNPay error:", error);
    res.status(500).json({ error: "Failed to create VNPay payment URL" });
  }
});

// 🔹 Route 2: Xử lý IPN khi VNPay redirect lại
app.get("/vnpay-ipn", async (req, res) => {
  const queryParams = { ...req.query };
  const vnp_SecureHash = queryParams.vnp_SecureHash;
  delete queryParams.vnp_SecureHash;
  delete queryParams.vnp_SecureHashType;

  const isValid = vnpay.verifyReturnUrl(queryParams, vnp_SecureHash);
  if (!isValid) {
    console.log("❌ Checksum không hợp lệ");
    return res.status(400).json({ RspCode: "97", Message: "Invalid checksum" });
  }

  const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionStatus } = queryParams;

  if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00") {
    try {
      await db.collection("payments").doc(vnp_TxnRef).set({
        status: "success",
        vnp_TransactionNo: queryParams.vnp_TransactionNo,
        vnp_ResponseCode,
        vnp_PayDate: queryParams.vnp_PayDate,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log(`✅ Firestore đã cập nhật cho đơn ${vnp_TxnRef}`);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật Firestore:", error);
    }
  }

  // ✅ Redirect về frontend với toàn bộ query
  res.redirect(`http://localhost:5173/payment-success?${new URLSearchParams(req.query).toString()}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ VNPay Server is running at http://localhost:${PORT}`);
});
