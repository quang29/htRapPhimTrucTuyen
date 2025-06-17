
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Tải file JSON từ Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const plans = [
  {
    id: "basic",
    data: {
      name: "Basic",
      badge: "Starter",
      subtitle: "For Individual Viewers",
      monthlyPrice: 49000,
      yearlyPrice: 299000, // giảm giá
      currency: "VND",
      description: "Per user / Month, Billed Annually",
      buttonText: "Start with Basic plan",
      features: [
        "HD streaming quality",
        "Watch on 1 device at a time",
        "Unlimited movies & TV shows",
        "Ad-supported content",
        "Mobile & tablet access",
        "Standard customer support",
        "Download on 1 device",
        "Basic recommendation engine",
      ],
      popular: false,
      darkTheme: true,
    },
  },
  {
    id: "standard",
    data: {
      name: "Standard",
      badge: "Popular",
      subtitle: "For Families & Small Groups",
      monthlyPrice: 99000,
      yearlyPrice: 499000, // giảm giá
      currency: "VND",
      description: "Per user / Month, Billed Annually",
      buttonText: "Start with Standard plan",
      features: [
        "Full HD streaming quality",
        "Watch on 2 devices simultaneously",
        "Unlimited movies & TV shows",
        "Ad-free experience",
        "All devices supported",
        "Priority customer support",
        "Download on 2 devices",
        "Advanced recommendation engine",
        "Early access to new releases",
        "Exclusive behind-the-scenes content",
      ],
      popular: true,
      darkTheme: false,
    },
  },
  {
    id: "premium",
    data: {
      name: "Premium",
      badge: "Ultimate",
      subtitle: "For Movie Enthusiasts & Large Families",
      monthlyPrice: 149000,
      yearlyPrice: 699000, // giảm giá
      currency: "VND",
      description: "Per user / Month, Billed Annually",
      buttonText: "Start with Premium plan",
      features: [
        "4K Ultra HD streaming quality",
        "Watch on 4 devices simultaneously",
        "Unlimited movies & TV shows",
        "Ad-free premium experience",
        "All devices + Smart TV support",
        "VIP customer support 24/7",
        "Download on 4 devices",
        "AI-powered personalized recommendations",
        "Exclusive premium content library",
        "Director cuts & bonus features",
        "Virtual cinema experiences",
        "Priority access to premieres",
      ],
      popular: false,
      darkTheme: true,
    },
  },
];

async function importPlans() {
  for (const plan of plans) {
    await db.collection("plans").doc(plan.id).set(plan.data);
    console.log(`✅ Plan '${plan.id}' imported successfully`);
  }
  process.exit();
}

importPlans();
