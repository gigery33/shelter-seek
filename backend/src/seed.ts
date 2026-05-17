import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma";
import { Amenity } from "./generated/prisma/client";

const ukrToLat: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
  ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "yu", я: "ya",
  А: "A", Б: "B", В: "V", Г: "H", Ґ: "G", Д: "D", Е: "E", Є: "Ye",
  Ж: "Zh", З: "Z", И: "Y", І: "I", Ї: "Yi", Й: "Y", К: "K", Л: "L",
  М: "M", Н: "N", О: "O", П: "P", Р: "R", С: "S", Т: "T", У: "U",
  Ф: "F", Х: "Kh", Ц: "Ts", Ч: "Ch", Ш: "Sh", Щ: "Shch", Ь: "", Ю: "Yu", Я: "Ya",
};

function slugify(text: string): string {
  const translit = text
    .split("")
    .map((ch) => ukrToLat[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return translit;
}

const shelters = [
  {
    name: "Хрещатик",
    type: "METRO" as const,
    description: "Станція метро Хрещатик, центральна частина міста",
    address: "вул. Хрещатик, 1",
    lat: 50.4483,
    lng: 30.5239,
    amenities: [] as Amenity[],
    capacity: 500,
    status: "OPEN" as const,
  },
  {
    name: "Майдан Незалежності",
    type: "METRO" as const,
    description: "Станція метро Майдан Незалежності, обладнана питною водою",
    address: "Майдан Незалежності",
    lat: 50.4501,
    lng: 30.5249,
    amenities: [Amenity.WATER],
    capacity: 800,
    status: "OPEN" as const,
  },
  {
    name: "Арсенальна",
    type: "METRO" as const,
    description: "Найглибша станція метро у світі, є вода та інтернет",
    address: "вул. Івана Мазепи, 1",
    lat: 50.4417,
    lng: 30.5468,
    amenities: [Amenity.WATER, Amenity.INTERNET],
    capacity: 600,
    status: "OPEN" as const,
  },
  {
    name: "Вокзальна",
    type: "METRO" as const,
    description: "Станція метро біля центрального залізничного вокзалу",
    address: "Привокзальна площа, 1",
    lat: 50.4395,
    lng: 30.4905,
    amenities: [Amenity.WATER, Amenity.ACCESSIBLE],
    capacity: 700,
    status: "OPEN" as const,
  },
  {
    name: "Палац Спорту",
    type: "METRO" as const,
    description: "Станція метро Палац Спорту з доступом до води та інтернету",
    address: "вул. Еспланадна, 1",
    lat: 50.4459,
    lng: 30.5190,
    amenities: [Amenity.WATER, Amenity.INTERNET],
    capacity: 550,
    status: "OPEN" as const,
  },
  {
    name: "Шевченківське укриття",
    type: "BOMB_SHELTER" as const,
    description: "Капітальне укриття в Шевченківському районі",
    address: "вул. Володимирська, 45",
    lat: 50.4604,
    lng: 30.4989,
    amenities: [Amenity.WATER, Amenity.ACCESSIBLE],
    capacity: 300,
    status: "OPEN" as const,
  },
  {
    name: "Печерське укриття",
    type: "BOMB_SHELTER" as const,
    description: "Укриття в Печерському районі з водопостачанням",
    address: "вул. Михайла Бойчука, 2",
    lat: 50.4228,
    lng: 30.5377,
    amenities: [Amenity.WATER],
    capacity: 250,
    status: "OPEN" as const,
  },
  {
    name: "Подільське укриття",
    type: "BOMB_SHELTER" as const,
    description: "Велике укриття на Подолі з усіма зручностями",
    address: "вул. Межигірська, 25",
    lat: 50.4655,
    lng: 30.5197,
    amenities: [Amenity.WATER, Amenity.INTERNET, Amenity.ACCESSIBLE],
    capacity: 400,
    status: "OPEN" as const,
  },
  {
    name: "Паркінг на Хрещатику",
    type: "UNDERGROUND_PARKING" as const,
    description: "Підземний паркінг на Хрещатику, пристосований для укриття",
    address: "вул. Хрещатик, 15",
    lat: 50.4462,
    lng: 30.5222,
    amenities: [Amenity.WATER, Amenity.INTERNET],
    capacity: 200,
    status: "OPEN" as const,
  },
  {
    name: "Паркінг Arena City",
    type: "UNDERGROUND_PARKING" as const,
    description: "Підземний паркінг ТРЦ Arena City",
    address: "вул. Велика Васильківська, 75",
    lat: 50.4369,
    lng: 30.5180,
    amenities: [Amenity.WATER, Amenity.ACCESSIBLE],
    capacity: 350,
    status: "CLOSED" as const,
  },
];

async function seed() {
  const password = await bcrypt.hash("admin", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin" },
    update: { password, isAdmin: true },
    create: { email: "admin", password, isAdmin: true },
  });
  console.log(`Admin user: ${user.email} / admin`);

  for (const s of shelters) {
    const slug = slugify(s.name);
    await prisma.shelter.upsert({
      where: { slug },
      update: {
        name: s.name,
        type: s.type,
        description: s.description,
        address: s.address,
        lat: s.lat,
        lng: s.lng,
        amenities: s.amenities,
        capacity: s.capacity,
        status: s.status,
      },
      create: {
        slug,
        name: s.name,
        type: s.type,
        description: s.description,
        address: s.address,
        lat: s.lat,
        lng: s.lng,
        amenities: s.amenities,
        capacity: s.capacity,
        status: s.status,
      },
    });
    console.log(`Shelter: ${s.name} (${slug})`);
  }

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
