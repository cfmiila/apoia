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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <h4>Depoimentos</h4>
        <h2 className="text-3xl font-bold text-blue-950 mb-8">
          O Que As Pessoas Dizem Sobre Nós.
        </h2>

        <div className="relative bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
          <div className="flex justify-center">
            <div className="w-16 h-16 overflow-hidden rounded-full border-4 border-blue-500">
              <Image
                src={testimonials[selected].image}
                alt={testimonials[selected].name}
                width={64} // Tamanho fixo da imagem
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <p className="text-lg text-gray-700 italic mt-4">
            {testimonials[selected].message}
          </p>
          <h3 className="font-semibold text-blue-950 mt-3">
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
