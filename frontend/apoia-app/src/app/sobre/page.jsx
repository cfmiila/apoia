
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
  
  export default function SobrePage() {
    return (
      <div className="min-h-screen">
        {/* Seção Missão, Visão e Valores */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Sobre o ConectaDoar</h1>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card Missão */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Missão</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Conectar doadores a ONGs de forma rápida, segura e transparente, 
                  facilitando o apoio a causas sociais e maximizando o impacto positivo.
                </CardContent>
              </Card>
              
              {/* Card Visão */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Visão</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  Ser a principal plataforma de integração entre doadores e organizações 
                  sem fins lucrativos no Brasil, transformando a cultura de doação.
                </CardContent>
              </Card>
              
              {/* Card Valores */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Valores</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Transparência</li>
                    <li>Impacto social</li>
                    <li>Facilidade</li>
                    <li>Confiança</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
  
        {/* Seção Nossa História */}
        <section className="py-12 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nossa História</h2>
          <div className="max-w-3xl mx-auto text-center text-gray-600">
            <p className="mb-4">
              Fundado em 2025, o Apoia+ nasceu da necessidade de criar uma ponte 
              direta entre quem quer ajudar e quem precisa de ajuda.
            </p>
            <p>
              Nossa plataforma foi desenvolvida com tecnologia moderna para garantir 
              segurança nas transações e transparência no destino dos recursos.
            </p>
          </div>
        </section>
  
        {/* Seção Números que Importam */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Números que Importam</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-4xl font-bold text-blue-600">50+</p>
                <p className="text-gray-600">ONGs cadastradas</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-600">1K+</p>
                <p className="text-gray-600">Doadores ativos</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-600">R$500K+</p>
                <p className="text-gray-600">Arrecadados</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-blue-600">100%</p>
                <p className="text-gray-600">Transparente</p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Seção Equipe */}
        <section className="py-12 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nossa Equipe</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Time de Desenvolvimento</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Profissionais especializados em criar soluções tecnológicas seguras 
                e eficientes para conectar doadores e ONGs.
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Time de Impacto Social</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Especialistas em causas sociais que garantem que cada doação tenha o 
                máximo impacto positivo na sociedade.
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Time de Parcerias</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Responsáveis por criar alianças estratégicas com organizações que 
                compartilham nossa missão.
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }