import { prisma } from "./src/prisma";

async function check() {
  const links = await prisma.link.findMany();
  console.log("Total links in prisma:", links.length);
  for (const l of links) {
    console.log(`- [${l.shortCode}] -> ${l.originalUrl}`);
  }
}
check().finally(() => prisma.$disconnect());
