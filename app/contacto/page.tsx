export default function ContactoPage() {
  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contáctanos</h1>
      <p className="text-lg text-gray-600 mb-8">
        Cotiza tu proyecto o solicita más información.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulario de contacto */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <textarea
              rows={4}
              placeholder="Mensaje..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
              Enviar mensaje
            </button>
          </form>
        </div>
        {/* Información de contacto */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h3>
            <div className="space-y-3 text-gray-600">
              <p><strong>Teléfono:</strong> +51 930 747 399</p>
              <p><strong>Email:</strong> ludier@email.com</p>
              <p><strong>Dirección:</strong> Lima, Perú</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}