import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const admins = [
    { name: "Suryanshad", email: "suryanshad@scam.com", password: "Admin@123", role: "admin" },
    { name: "Virajad", email: "vermaviraj30dec@gmail.com", password: "Admin@123", role: "admin" },
    { name: "Lavinad", email: "lavinvirmani2025@gmail.com", password: "Admin@123", role: "admin" }
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        role: admin.role
      }
    });
  }

  console.log("Admin accounts created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

