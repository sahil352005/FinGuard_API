import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (be careful in production!)
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123456", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@finguard.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  });

  // Create analyst user
  const analystPassword = await bcrypt.hash("Analyst@123456", 10);
  const analyst = await prisma.user.create({
    data: {
      email: "analyst@finguard.com",
      password: analystPassword,
      firstName: "Analyst",
      lastName: "User",
      role: "ANALYST",
    },
  });

  // Create viewer user
  const viewerPassword = await bcrypt.hash("Viewer@123456", 10);
  await prisma.user.create({
    data: {
      email: "viewer@finguard.com",
      password: viewerPassword,
      firstName: "Viewer",
      lastName: "User",
      role: "VIEWER",
    },
  });

  // Create sample transactions for admin
  const today = new Date();

  await prisma.transaction.createMany({
    data: [
      {
        userId: admin.id,
        amount: 50000,
        type: "INCOME",
        category: "Salary",
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        note: "Monthly salary",
      },
      {
        userId: admin.id,
        amount: 5000,
        type: "EXPENSE",
        category: "Rent",
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        note: "Monthly rent payment",
      },
      {
        userId: admin.id,
        amount: 2000,
        type: "EXPENSE",
        category: "Groceries",
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        note: "Weekly groceries",
      },
      {
        userId: admin.id,
        amount: 10000,
        type: "INCOME",
        category: "Freelance",
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        note: "Freelance project payment",
      },
      {
        userId: admin.id,
        amount: 500,
        type: "EXPENSE",
        category: "Utilities",
        date: today,
        note: "Electricity bill",
      },
    ],
  });

  // Create sample transactions for analyst
  await prisma.transaction.createMany({
    data: [
      {
        userId: analyst.id,
        amount: 45000,
        type: "INCOME",
        category: "Salary",
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
        note: "Monthly salary",
      },
      {
        userId: analyst.id,
        amount: 4500,
        type: "EXPENSE",
        category: "Rent",
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        note: "Monthly rent",
      },
      {
        userId: analyst.id,
        amount: 1500,
        type: "EXPENSE",
        category: "Food",
        date: today,
        note: "Restaurant expenses",
      },
    ],
  });

  console.log("✅ Database seed completed!");
  console.log("\n📊 Test Accounts:");
  console.log("────────────────────────────────────────");
  console.log(
    "Admin    → admin@finguard.com      / Admin@123456"
  );
  console.log(
    "Analyst  → analyst@finguard.com    / Analyst@123456"
  );
  console.log(
    "Viewer   → viewer@finguard.com     / Viewer@123456"
  );
  console.log("────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
