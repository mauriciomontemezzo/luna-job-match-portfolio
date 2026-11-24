import {
  diagnosticarElegibilidadeV5
} from "../../lib/diagnosticoElegibilidadeV5";

type Props = {
  cargoVaga: string;
  cargosDesejados: string;
  localizacao: string;
  experiencias: unknown[];
};

const rotulosRelacao = {
  direta: "Correspondencia direta",
  parcial: "Relacao parcial",
  nao_identificada: "Nao identificada"
} as const;

const rotulosSenioridade = {
  indicio_correspondencia: "Indicio de correspondencia",
  possivel_diferenca: "Possivel diferenca",
  nao_confirmada: "Nao confirmada"
} as const;

const rotulosGeografia = {
  brasil_mencionado: "Brasil mencionado",
  regiao_compativel: "Regiao compativel mencionada",
  global: "Anuncio global",
  restricao_identificada: "Restricao identificada",
  localizacao_limitada: "Localizacao limitada",
  nao_confirmada: "Nao confirmada"
} as const;

export default function PainelElegibilidadeV5({
  cargoVaga,
  cargosDesejados,
  localizacao,
  experiencias
}: Props) {
  const resultado = diagnosticarElegibilidadeV5(
    cargoVaga,
    cargosDesejados,
    localizacao,
    experiencias
  );

  return (
    <section className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
      <h3 className="text-base font-bold text-amber-200">
        Diagnostico de elegibilidade V5
      </h3>

      <p className="mt-1 text-xs text-amber-100/70">
        Experimental - revisao necessaria
      </p>

      <div className="mt-4 space-y-2 text-sm text-slate-200">
        <p>
          <strong>Relacao profissional:</strong>{" "}
          {rotulosRelacao[resultado.relacaoProfissional]}
        </p>

        <p>
          <strong>Senioridade:</strong>{" "}
          {rotulosSenioridade[resultado.situacaoSenioridade]}
        </p>

        <p>
          <strong>Geografia:</strong>{" "}
          {rotulosGeografia[resultado.situacaoGeografica]}
        </p>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-emerald-300">
          Evidencias identificadas
        </h4>

        {resultado.evidencias.length === 0 ? (
          <p className="mt-2 text-sm text-slate-300">
            Nenhuma evidencia suficiente identificada.
          </p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {resultado.evidencias.map((evidencia, indice) => (
              <li key={indice}>{evidencia}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-amber-200">
          Pendencias de verificacao
        </h4>

        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
          {resultado.pendencias.map((pendencia, indice) => (
            <li key={indice}>{pendencia}</li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        A elegibilidade nao esta confirmada.
        Este diagnostico nao altera pontuacao,
        prioridade, classificacao ou exportacao.
      </p>
    </section>
  );
}
