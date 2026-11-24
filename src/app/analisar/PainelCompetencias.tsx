import type {
  DiagnosticoCompetencias
} from "../../lib/diagnosticoCompetencias";

type Props = {
  diagnostico: DiagnosticoCompetencias;
  perfilSemCompetencias: boolean;
};

export default function PainelCompetencias({
  diagnostico,
  perfilSemCompetencias
}: Props) {
  const resultado = diagnostico.resultado;

  return (
    <section className="mt-4 rounded-lg border border-sky-400/30 p-4">
      <h4 className="text-sm font-semibold text-sky-300">
        Analise de competencias
      </h4>

      <p className="mt-2 text-xs text-slate-400">
        Diagnostico experimental baseado em requisitos
        estruturados. Nao altera pontuacao nem prioridade.
      </p>

      {diagnostico.situacao !== "analisado" && (
        <p className="mt-3 text-sm text-slate-300">
          {diagnostico.mensagem}
        </p>
      )}

      {diagnostico.situacao === "analisado" &&
        perfilSemCompetencias && (
          <p className="mt-3 text-sm text-amber-200">
            O perfil nao possui competencias registradas
            para comparacao. Revise o perfil antes de
            interpretar os resultados.
          </p>
        )}

      {diagnostico.situacao === "analisado" &&
        !perfilSemCompetencias &&
        resultado && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-emerald-300">
              Identificadas: {resultado.identificadas}
            </p>

            <p className="text-sm text-amber-200">
              A confirmar: {resultado.pendentes}
            </p>

            <p className="text-sm text-slate-300">
              Nao identificadas no perfil:{" "}
              {resultado.naoIdentificadas}
            </p>

            <p className="text-xs text-slate-500">
              Competencias nao identificadas nao significam
              ausencia de conhecimento. Verifique os
              requisitos completos da oportunidade.
            </p>
          </div>
        )}
    </section>
  );
}
