import Image from "next/image";

const causes = [
  {
    title: "ONG Esperança",
    amount: "R$ 54.200.00 total arrecadado",
    description: "Apoio a crianças carentes",
    image: "/cause1.jpg",
  },
  {
    title: "Verde Vivo",
    amount: "R$ 42.000.00 total arrecadado",
    description: "Preservação ambiental",
    image: "/cause2.jpg",
  },
  {
    title: "Cuidar Mais",
    amount: "R$ 15.000.00 total arrecadado",
    description: "Assistência a idosos",
    image: "/cause3.jpg",
  },
];

export default function FeaturedCauses() {
  return (
    <section className="py-16 bg-gray-100 text-center">
      <h4 className="text-center">A causa</h4>
      <h2 className="text-4xl font-bold text-blue-950">Causas Em Destaque</h2>
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        {causes.map((cause, index) => (
          <div
            key={index}
            className="bg-white shadow-xl rounded-2xl overflow-hidden w-80 md:w-96"
          >
            <Image
              src={cause.image}
              alt={cause.title}
              width={384}
              height={240}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold">{cause.title}</h3>
              <p className="text-gray-700 text-lg font-medium">
                {cause.amount}
              </p>
              <p className="text-gray-500 text-sm mt-1">{cause.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
