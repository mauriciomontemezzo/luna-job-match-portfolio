import {
  adaptarDiagnosticoComplementarV3
} from "../../lib/adaptadorComplementarV3";

type Props = {
  cargoVaga: string;
  cargosDesejados: string;
};

const rotulos = {
  direta: "Correspondencia direta",
  parcial: "Correspondencia parcial",
  nao_identificada: "Nao identificada"
} as const;

export default function PainelDiagnosticoV3({
  cargoVaga,
  cargosDesejados
}: Props) {
  const diagnosticos = adaptarDiagnosticoComplementarV3(
    cargoVaga,
    cargosDesejados
  );

  return (
    <section className="mt-4 rounded-xl border border-sky-400/30 bg-sky-400/5 p-4">
      <h3 className="font-semibold text-sky-300">
        Diagnostico multicarreiras V3
      </h3>

      <p className="mt-2 text-xs text-slate-400">
        Analise experimental informativa.
        Nao altera pontuacao, prioridade ou elegibilidade.
      </p>

      {diagnosticos.length === 0 ? (
        <p className="mt-3 text-sm text-slate-300">
          Nenhum cargo desejado informado.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {diagnosticos.map((item, indice) => (
            <div
              key={`${indice}-${item.cargoDesejado}`}
              className="rounded-lg border border-white/10 p-3"
            >
              <p className="font-medium text-white">
                {item.cargoDesejado}
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Classificacao original:{" "}
                {rotulos[item.classificacaoOriginal]}
              </p>

              <p className="mt-1 text-sm text-slate-300">
                Diagnostico expandido:{" "}
                {rotulos[item.classificacaoExpandida]}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Origem da expansao V3 anterior:{" "}
                {item.origemExpansao}
              </p>

              {item.origemComplementar && (
                <p className="mt-2 text-sm text-sky-300">
                  Origem da relacao complementar:{" "}
                  Catalogo complementar V3
                </p>
              )}

              {item.origemComplementar && (
                <div className="mt-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3">
                  <p className="text-sm font-semibold text-sky-200">
                    Relacao profissional complementar
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    Correspondencia parcial experimental
                    identificada pelo catalogo complementar V3.
                  </p>
                </div>
              )}

              {item.revisaoComplementar && (
                <p
                  role="status"
                  className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200"
                >
                  Revisao complementar necessaria.
                  Confirme a relacao profissional antes
                  de considerar esta oportunidade.
                </p>
              )}

              {item.revisaoSemantica && (
                <p
                  role="status"
                  className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200"
                >
                  Revisao semantica necessaria.
                  Confirme a equivalencia profissional.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
