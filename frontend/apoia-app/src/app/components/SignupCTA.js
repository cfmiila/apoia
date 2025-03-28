export default function CallToAction() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-6 lg:px-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
          Cadastre-se e Comece a Ajudar Hoje!
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-10">
          Escolha o seu perfil e faça a diferença no mundo agora mesmo.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="px-6 py-4 text-lg font-semibold bg-blue-600 text-white rounded-xl shadow-md transition hover:bg-blue-700">
            Sou um Doador
          </button>
          <button className="px-6 py-4 text-lg font-semibold bg-green-600 text-white rounded-xl shadow-md transition hover:bg-green-700">
            Sou uma ONG
          </button>
        </div>
      </div>
    </section>
  );
}
