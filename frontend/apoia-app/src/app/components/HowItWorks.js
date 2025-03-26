import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { FaHandshake, FaDonate, FaChartLine, FaHandsHelping } from "react-icons/fa"; // Importando os ícones

export default function HowItWorks() {
  const items = [
    { 
      title: "ONGs verificadas", 
      text: "Conecte-se com ONGs verificadas", 
      icon: <FaHandshake className="text-blue-500 text-4xl" />
    },
    { 
      title: "Doações seguras", 
      text: "Faça doações seguras e rápidas", 
      icon: <FaDonate className="text-blue-500 text-4xl" />
    },
    { 
      title: "Faça diferença", 
      text: "Acompanhe o impacto da sua contribuição", 
      icon: <FaChartLine className="text-blue-500 text-4xl" />
    },
    { 
      title: "Ajude quem precisa", 
      text: "Seja um voluntário e ajude presencialmente", 
      icon: <FaHandsHelping className="text-blue-500 text-4xl" />
    },
  ];

  return (
    <div className="flex flex-col items-center bg-white py-12">
      <h1 className="text-blue-950 text-3xl font-semibold mb-8">Como funciona</h1>
      <Carousel className="relative">
        <CarouselContent className="flex gap-6 justify-center overflow-x-auto py-6">
          {items.map((item, index) => (
            <CarouselItem key={index} className="flex justify-center items-center w-full sm:w-1/2 lg:w-1/4">
              <div className="p-4 w-full">
                <Card className="shadow-xl border border-gray-200 rounded-lg bg-white transition-transform duration-300 hover:scale-105">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4">{item.icon}</div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-950 bg-white p-2 rounded-full shadow-lg hover:bg-blue-200" />
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-blue-950 bg-white p-2 rounded-full shadow-lg hover:bg-blue-200" />
      </Carousel>
    </div>
  );
}
