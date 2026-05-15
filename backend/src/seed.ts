import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma";

async function seed() {
  const existing = await prisma.user.findUnique({
    where: { email: "admin" },
  });

  if (!existing) {
    const password = await bcrypt.hash("admin", 10);
    await prisma.user.create({
      data: {
        email: "admin",
        password,
        isAdmin: true,
      },
    });
    console.log("Admin user created (admin / admin)");
  } else {
    console.log("Admin user already exists");
  }

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
