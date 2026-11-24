"use client";

import { useState } from "react";

import {
  diagnosticarMultiplosCargos
} from "../../lib/diagnosticoMultiplosCargos";

export default function PainelDiagnosticoProfissional({
  cargoVaga,
  cargosDesejados
}: {
  cargoVaga: string;
  cargosDesejados: string;
}) {
  const [expandido, setExpandido] = useState(false);

  const diagnosticos = diagnosticarMultiplosCargos(
    cargoVaga,
    cargosDesejados
  );

  if (diagnosticos.length === 0) return null;

  const visiveis = expandido
    ? diagnosticos
    : diagnosticos.slice(0, 3);

  return (
    <section className="mt-4 rounded-lg border border-indigo-400/30 p-4">
      <h4 className="text-sm font-semibold text-indigo-300">
        Diagnostico profissional experimental
      </h4>

      <p className="mt-2 text-xs text-slate-400">
        Comparacao baseada nos titulos profissionais.
        Nao altera pontuacao nem prioridade.
      </p>

      <div className="mt-4 space-y-3">
        {visiveis.map((item) => (
          <div
            key={item.cargoDesejado}
            className="rounded-lg border border-white/10 p-3"
          >
            <p className="text-sm font-semibold text-white">
              {item.cargoDesejado}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={
                  item.classificacaoAtual === "direta"
                    ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300"
                    : item.classificacaoAtual === "parcial"
                      ? "rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300"
                      : "rounded-full bg-slate-400/10 px-3 py-1 text-xs font-semibold text-slate-300"
                }
              >
                {item.classificacaoAtual === "direta"
                  ? "Correspondencia direta"
                  : item.classificacaoAtual === "parcial"
                    ? "Correspondencia parcial"
                    : "Correspondencia nao identificada"}
              </span>

              {item.situacao === "revisar" && (
                <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  Revisao recomendada
                </span>
              )}
            </div>

            {item.situacao !== "revisar" && (
              <p className="mt-2 text-xs text-slate-400">
                Nenhum alerta adicional identificado.
              </p>
            )}

            {item.motivos.map((motivo, indice) => (
              <p
                key={indice}
                className="mt-2 text-xs text-slate-400"
              >
                {motivo}
              </p>
            ))}
          </div>
        ))}
      </div>

      {diagnosticos.length > 3 && (
        <button
          type="button"
          onClick={() => setExpandido(!expandido)}
          className="mt-4 text-sm font-semibold text-emerald-300 underline"
        >
          {expandido
            ? "Mostrar menos"
            : `Mostrar todos (${diagnosticos.length})`}
        </button>
      )}

      <p className="mt-4 text-xs text-slate-500">
        A ausencia de alerta nao confirma compatibilidade.
        Confira os requisitos completos da vaga.
      </p>
    </section>
  );
}
