export default function CTA() {
  return (
    <section className="relative py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 p-10 text-center backdrop-blur">
          <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
            Pronto para criar algo incrível?
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/70">
            Vamos tirar sua ideia do papel com qualidade, performance e design de alto nível.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="/contato"
              className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
            >
              Vamos Conversar
              <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </a>
            <a
              href="https://wa.me/5511999999999?text=Olá,%20vi%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20seus%20serviços"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
            >
              WhatsApp
              <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
