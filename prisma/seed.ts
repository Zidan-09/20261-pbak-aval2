import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TripStatus } from "#/generated/prisma/client.js";

const connectionString = process.env["DATABASE_URL"] || "postgresql://postgres:postgres@localhost:5432/trip_requests_db";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });



const names = [
  "João Silva",
  "Maria Oliveira",
  "Carlos Santos",
  "Ana Souza",
  "Pedro Costa",
  "Lucas Ferreira",
  "Juliana Alves",
  "Rafael Martins",
];

const locations = [
  "Teresina",
  "Parnaíba",
  "Fortaleza",
  "São Luís",
  "Recife",
  "Natal",
  "Salvador",
  "Brasília",
];

const purposes = [
  "Participação em evento acadêmico",
  "Reunião institucional",
  "Atividade de pesquisa",
  "Atividade de extensão",
  "Aula prática",
  "Visita técnica",
  "Representação administrativa",
];

function randomItem<T>(array: T[]): T {
  const element = array[Math.floor(Math.random() * array.length)];

  if (element === undefined) throw new Error("Invalid Array");

  return element;
}

function randomDate(daysAhead: number = 90) {
  const date = new Date();

  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  date.setHours(
    Math.floor(Math.random() * 8) + 7,
    0,
    0,
    0,
  );

  return date;
}

function addHours(date: Date, hours: number) {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

async function main() {
  const databaseAlreadyPopulated = await prisma.trip.count() > 0;

  if (databaseAlreadyPopulated) {
    console.log("Database already was populated, exiting seeder...");
    return;
  };

  const trips = Array.from({ length: 15 }).map(() => {
    const departureAt = randomDate();
    const returnAt = addHours(
      departureAt,
      Math.floor(Math.random() * 8) + 2,
    );

    return {
      requesterName: randomItem(names),
      origin: randomItem(locations),
      destination: randomItem(locations),
      departureAt,
      returnAt,
      purpose: randomItem(purposes),
      passengerCount: Math.floor(Math.random() * 20) + 1,
      status: randomItem([
        TripStatus.PENDING,
        TripStatus.CANCELLED
      ]),
    };
  });

  await prisma.trip.createMany({
    data: trips,
  });

  console.log("15 trips are registered on database");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });