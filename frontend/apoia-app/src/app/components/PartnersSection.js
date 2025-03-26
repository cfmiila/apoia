import Image from "next/image";

const partners = [
  { name: "Mais", logo: "/partner1.png" },
  { name: "Apoame", logo: "/partner2.png" },
  { name: "Organama", logo: "/partner3.png" },
  { name: "Cultivando a Vida", logo: "/partner4.png" },
  { name: "AMAI", logo: "/partner5.png" },
];

export default function PartnersSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <h2 className="text-3xl font-bold text-blue-950 mb-8">
          Nossos Parceiros
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex justify-center items-center p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={120}
                className="object-contain w-[100px] h-[100px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
