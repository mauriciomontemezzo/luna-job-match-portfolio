import {
  avaliarOportunidadeV6
} from "../../lib/avaliacaoOportunidadeV6";

import {
  diagnosticarElegibilidadeV5
} from "../../lib/diagnosticoElegibilidadeV5";

type Props = {
  cargoVaga: string;
  cargosDesejados: string;
  localizacao: string;
  experiencias: unknown[];
};

const apresentacao = {
  indicios_favoraveis: {
    titulo: "Indicios favoraveis",
    descricao:
      "Foram identificados sinais positivos nos criterios avaliados.",
    estilo:
      "border-emerald-400/30 bg-emerald-400/5",
    corTitulo: "text-emerald-300"
  },
  verificacao_necessaria: {
    titulo: "Verificacao necessaria",
    descricao:
      "As informacoes disponiveis ainda sao insuficientes.",
    estilo:
      "border-sky-400/30 bg-sky-400/5",
    corTitulo: "text-sky-300"
  },
  alertas_relevantes: {
    titulo: "Alertas relevantes",
    descricao:
      "Existem indicadores que exigem atencao adicional.",
    estilo:
      "border-amber-400/30 bg-amber-400/5",
    corTitulo: "text-amber-300"
  }
} as const;

export default function PainelAvaliacaoV6({
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

  const resultado = avaliarOportunidadeV6(
    diagnostico
  );

  const visual = apresentacao[resultado.situacao];

  return (
    <section
      className={
        "mt-4 rounded-xl border p-4 " +
        visual.estilo
      }
    >
      <h3 className="text-base font-bold text-white">
        Avaliacao de oportunidade V6
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Experimental - avaliacao informativa
      </p>

      <p
        className={
          "mt-3 font-semibold " +
          visual.corTitulo
        }
      >
        {visual.titulo}
      </p>

      <p className="mt-2 text-sm text-slate-300">
        {visual.descricao}
      </p>

      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
        {resultado.motivos.map((motivo, indice) => (
          <li key={indice}>{motivo}</li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-slate-400">
        Esta avaliacao nao confirma elegibilidade,
        nao representa chance de contratacao e
        nao altera pontuacao, prioridade,
        classificacao, ordenacao ou exportacao.
      </p>
    </section>
  );
}
