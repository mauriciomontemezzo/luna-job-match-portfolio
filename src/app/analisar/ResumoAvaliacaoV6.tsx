import {
  diagnosticarElegibilidadeV5
} from "../../lib/diagnosticoElegibilidadeV5";

import {
  avaliarOportunidadeV6
} from "../../lib/avaliacaoOportunidadeV6";

type Props = {
  cargoVaga: string;
  cargosDesejados: string;
  localizacao: string;
  experiencias: unknown[];
};

const visuais = {
  indicios_favoraveis: {
    titulo: "Indicios favoraveis",
    cor: "border-emerald-400/30 text-emerald-300"
  },
  verificacao_necessaria: {
    titulo: "Verificacao necessaria",
    cor: "border-sky-400/30 text-sky-300"
  },
  alertas_relevantes: {
    titulo: "Alertas relevantes",
    cor: "border-amber-400/30 text-amber-300"
  }
} as const;

export default function ResumoAvaliacaoV6({
  cargoVaga,
  cargosDesejados,
  localizacao,
  experiencias
}: Props) {
  const diagnostico = diagnosticarElegibilidadeV5(
    cargoVaga,
    cargosDesejados,
    localizacao,
    experiencias
  );

  const avaliacao = avaliarOportunidadeV6(
    diagnostico
  );

  const visual = visuais[avaliacao.situacao];

  return (
    <span
      className={
        "mt-3 block rounded-lg border p-3 " +
        visual.cor
      }
    >
      <span className="block text-sm font-semibold">
        V6 - {visual.titulo}
      </span>

      <span className="mt-2 block text-sm text-slate-300">
        {avaliacao.motivos[0] ??
          "Informacoes insuficientes."}
      </span>

      <span className="mt-2 block text-xs text-slate-400">
        Avaliacao experimental.
        Elegibilidade nao confirmada.
      </span>
    </span>
  );
}
