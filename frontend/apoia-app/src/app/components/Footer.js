export default function Footer() {
  return (
    <footer className="bg-white py-10 border-t border-gray-200">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div>
            <h3 className="text-2xl font-bold text-blue-950">Apoia</h3>
            <p className="text-gray-600 mt-2">
              Conectando doadores e ONGs de forma simples e segura.
            </p>
          </div>

          {/* Links - Companhia */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Companhia</h4>
            <ul className="mt-2 space-y-2 text-gray-600">
              <li>
                <a href="#">Sobre</a>
              </li>
              <li>
                <a href="#">Carreiras</a>
              </li>
              <li>
                <a href="#">Mobile</a>
              </li>
            </ul>
          </div>

          {/* Links - Contato */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Contato</h4>
            <ul className="mt-2 space-y-2 text-gray-600">
              <li>
                <a href="#">Help/FAQ</a>
              </li>
              <li>
                <a href="#">Imprensa</a>
              </li>
              <li>
                <a href="#">Afiliados</a>
              </li>
            </ul>
          </div>

          {/* Links - Mais */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Mais</h4>
            <ul className="mt-2 space-y-2 text-gray-600">
              <li>
                <a href="#">Taxas</a>
              </li>
              <li>
                <a href="#">Parcerias</a>
              </li>
              <li>
                <a href="#">Dicas para Doadores</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Direitos reservados */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Todos os direitos reservados @companhia
        </p>
      </div>
    </footer>
  );
}
