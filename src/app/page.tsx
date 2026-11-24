import Link from "next/link";

const vagas = [
  {
    cargo: "Support Analyst, Brazil",
    empresa: "CI&T",
    score: 86,
  },
  {
    cargo: "FBS Production Support Engineer",
    empresa: "Capgemini Technology Services",
    score: 78,
  },
  {
    cargo: "Technical Support Engineer",
    empresa: "Ververica GmbH",
    score: 78,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1020] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-indigo-400">✦</span>
            <span className="text-xl font-bold tracking-wide">
              LUNA <span className="text-indigo-400">Job Match</span>
            </span>
          </div>
          <span className="rounded-full border border-indigo-400/30 px-4 py-2 text-xs text-indigo-300">
            Versão de demonstração
          </span>
        </header>

        <section className="py-16">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
            Inteligência para sua carreira
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Sua carreira.
            <br />
            <span className="text-indigo-400">
              Novas possibilidades.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400">
            Descubra oportunidades alinhadas ao seu perfil.
            Análise de currículo, busca inteligente e seleção
            personalizada de vagas em um único lugar.
          </p>
          <Link
            href="/analisar"
            className="mt-8 inline-flex items-center rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400"
          >
            Analisar meu currículo →
          </Link>
        </section>

        <section className="pb-16">
          <div className="mb-7">
            <h2 className="text-2xl font-bold">
              Dashboard de demonstração
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Dados de exemplo baseados nos testes da LUNA.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["25", "Vagas encontradas"],
              ["6", "Vagas selecionadas"],
              ["86/100", "Maior compatibilidade"],
            ].map(([valor, titulo]) => (
              <div
                key={titulo}
                className="rounded-2xl border border-white/10 bg-[#151C30] p-6"
              >
                <p className="text-3xl font-bold text-white">
                  {valor}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {titulo}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mb-5 mt-12 text-xl font-semibold">
            Oportunidades em destaque
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            {vagas.map((vaga) => (
              <article
                key={vaga.empresa}
                className="rounded-2xl border border-white/10 bg-[#151C30] p-6"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Alta prioridade
                  </span>
                  <span className="font-bold text-emerald-300">
                    {vaga.score}/100
                  </span>
                </div>
                <h4 className="text-lg font-bold">
                  {vaga.cargo}
                </h4>
                <p className="mt-3 text-sm text-slate-400">
                  {vaga.empresa}
                </p>
                <div className="mt-6 border-t border-white/10 pt-4 text-xs text-indigo-300">
                  Dados de demonstração
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
          LUNA Job Match — Plataforma em desenvolvimento
        </footer>
      </div>
    </main>
  );
}
