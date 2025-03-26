"use client";
import { FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";

const testimonials = [
  {
    name: "João Silva",
    role: "ONG Esperança",
    message:
      "A plataforma me ajudou a encontrar voluntários incríveis para minha ONG!",
    image: "/user1.png",
  },
  {
    name: "Arthur Chaves",
    role: "CEO da ONG Fome Zero",
    message:
      "O suporte e a transparência dessa plataforma são impressionantes.",
    image: "/user2.jpg",
  },
];

export default function TestimonialSection() {
  const [selected, setSelected] = useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-16">
        <h4 className="text-center">Depoimentos</h4>
        <h2 className="text-4xl md:text-5xl font-bold text-blue-950 text-center mb-10">
          O Que As Pessoas Dizem Sobre Nós.
        </h2>

        <div className="relative flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="bg-gray-100 p-6 rounded-xl shadow-lg max-w-lg">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={testimonials[selected].image}
                alt={testimonials[selected].name}
                width={64} // Tamanho fixo da imagem
                height={64}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
              />
            </div>
          </div>

          <p className="text-lg text-gray-700 italic mt-4">
            {testimonials[selected].message}
          </p>
          <h3 className="text-xl font-semibold text-blue-900">
            {testimonials[selected].name}
          </h3>
          <p className="text-gray-500 text-sm">{testimonials[selected].role}</p>

          <button
            onClick={() =>
              setSelected((prev) => (prev + 1) % testimonials.length)
            }
            className="absolute right-4 bottom-4 text-gray-600 hover:text-blue-600"
          >
            <FaChevronDown size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
