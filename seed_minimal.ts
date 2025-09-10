import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const d1 = await prisma.dealership.create({
    data: { name: 'Kennesaw Hyundai', location: 'Kennesaw, GA', contactEmail: 'sales@kennesawhyundai.com', contactPhone: '555-0100' }
  });
  const d2 = await prisma.dealership.create({
    data: { name: 'Shottenkirk Canton', location: 'Canton, GA', contactEmail: 'sales@shottenkirkcanton.com', contactPhone: '555-0200' }
  });
  const shop = await prisma.mysteryShop.create({
    data: {
      shopperName: 'Test Shopper',
      shopperEmail: 'shopper@example.com',
      shopperPhone: '555-0300',
      shopperType: 'retail',
      vehicleModel: 'Hyundai Tucson',
      tradeIn: '2018 Honda CR-V',
      creditTier: 'Prime',
      status: 'pending'
    }
  });
  console.log('Seeded:', { d1: d1.id, d2: d2.id, shop: shop.id });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
