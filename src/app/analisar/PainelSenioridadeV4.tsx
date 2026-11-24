import {
  compararSenioridadePerfilV4
} from "../../lib/compararSenioridadePerfilV4";

type Props = {
  cargoVaga: string;
  experiencias: unknown[];
};

const rotulos = {
  junior: "Junior",
  pleno: "Pleno",
  senior: "Senior",
  lideranca: "Lideranca",
  nao_identificada: "Nao identificada"
} as const;

const situacoes = {
  indicio_correspondencia:
    "Indicio de correspondencia de senioridade",
  possivel_diferenca:
    "Possivel diferenca de senioridade",
  nao_confirmada:
    "Senioridade nao confirmada"
} as const;

export default function PainelSenioridadeV4({
  cargoVaga,
  experiencias
}: Props) {
  const resultado = compararSenioridadePerfilV4(
    cargoVaga,
    experiencias
  );

  return (
    <section className="mt-4 rounded-xl border border-indigo-400/30 bg-indigo-400/5 p-4">
      <h3 className="font-semibold text-indigo-300">
        Diagnostico de senioridade profissional V4
      </h3>

      <p className="mt-2 text-xs text-slate-400">
        Analise experimental baseada nos titulos
        profissionais declarados no curriculo.
        Nao altera pontuacao, prioridade ou elegibilidade.
      </p>

      <div className="mt-4 space-y-3">
        <div className="rounded-lg border border-white/10 p-3">
          <p className="text-sm text-slate-300">
            Senioridade indicada na vaga:
          </p>

          <p className="mt-1 font-semibold text-white">
            {rotulos[resultado.nivelVaga]}
          </p>
        </div>

        <div className="rounded-lg border border-white/10 p-3">
          <p className="text-sm text-slate-300">
            Indicadores identificados no historico:
          </p>

          <p className="mt-1 font-semibold text-white">
            {resultado.niveisHistorico.length > 0
              ? resultado.niveisHistorico
                  .map((nivel) => rotulos[nivel])
                  .join(", ")
              : "Nenhum indicador identificado"}
          </p>
        </div>

        <div
          role="status"
          className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3"
        >
          <p className="font-semibold text-amber-200">
            {situacoes[resultado.situacao]}
          </p>

          <p className="mt-2 text-sm text-slate-300">
            {resultado.motivo}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        A presenca de um nivel profissional no titulo
        nao comprova experiencia suficiente para a vaga.
        Confira os requisitos completos.
      </p>
    </section>
  );
}
