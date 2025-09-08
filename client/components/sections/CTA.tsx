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
          <div className="mt-6">
            <a
              href="#contato"
              className="inline-flex rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
            >
              Entrar em Contato
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
