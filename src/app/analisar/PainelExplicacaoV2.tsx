import { explicarClassificacaoV2 } from "../../lib/explicacaoClassificacaoV2";

type Props = {
  cargoVaga: string;
  cargosDesejados: string;
  competenciasMencionadas: string[];
};

export default function PainelExplicacaoV2({
  cargoVaga,
  cargosDesejados,
  competenciasMencionadas
}: Props) {
  const explicacao = explicarClassificacaoV2(
    cargoVaga,
    cargosDesejados,
    competenciasMencionadas
  );

  if (
    explicacao.classificacao !==
    "oportunidades_relacionadas"
  ) {
    return null;
  }

  return (
    <section className="mt-4 rounded-xl border border-sky-400/30 bg-sky-400/5 p-4">
      <h3 className="font-semibold text-sky-300">
        Por que esta vaga foi classificada como relacionada?
      </h3>

      <p className="mt-2 text-xs text-slate-400">
        Explicacao experimental da classificacao V2.
        Nao altera pontuacao, prioridade ou elegibilidade.
      </p>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-white">
          Evidencias identificadas
        </h4>

        {explicacao.evidencias.length === 0 ? (
          <p className="mt-2 text-sm text-slate-300">
            Nenhuma evidencia adicional identificada.
          </p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {explicacao.evidencias.map((item, indice) => (
              <li key={indice}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-amber-200">
          Limitacoes da analise
        </h4>

        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
          {explicacao.limitacoes.map((item, indice) => (
            <li key={indice}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
