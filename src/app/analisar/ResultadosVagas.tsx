"use client";

import { useState } from "react";
import type { Preferencias } from "./PreferenciasVagas";

type Prioridade = "alta" | "media" | "baixa";

type Vaga = {
  id: string;
  cargo: string;
  empresa: string;
  localizacao: string;
  modalidade: string;
  pontuacao: number;
  prioridade: Prioridade;
  motivos: string[];
  pendencias: string[];
};

function objeto(
  valor: unknown
): valor is Record<string, unknown> {
  return (
    valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor)
  );
}

function vagaValida(valor: unknown): valor is Vaga {
  if (!objeto(valor)) return false;

  return (
    typeof valor.id === "string" &&
    typeof valor.cargo === "string" &&
    typeof valor.empresa === "string" &&
    typeof valor.localizacao === "string" &&
    typeof valor.modalidade === "string" &&
    typeof valor.pontuacao === "number" &&
    Number.isFinite(valor.pontuacao) &&
    valor.pontuacao >= 0 &&
    valor.pontuacao <= 100 &&
    ["alta", "media", "baixa"].includes(
      String(valor.prioridade)
    ) &&
    Array.isArray(valor.motivos) &&
    valor.motivos.every(
      item => typeof item === "string"
    ) &&
    Array.isArray(valor.pendencias) &&
    valor.pendencias.every(
      item => typeof item === "string"
    )
  );
}

export default function ResultadosVagas({
  perfil,
  preferencias
}: {
  perfil: unknown;
  preferencias: Preferencias;
}) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [filtro, setFiltro] =
    useState<"todas" | Prioridade>("todas");
  // SELECAO_VAGAS_V1
  const [selecionadas, setSelecionadas] =
    useState<string[]>([]);
  // EXPORTACAO_EXCEL_V1
  const [exportando, setExportando] = useState(false);
  const [erroExportacao, setErroExportacao] = useState("");



  async function simular() {
    if (carregando) return;

    setCarregando(true);
    setErro("");
    setVagas([]);
    setFiltro("todas");
    setSelecionadas([]);


    try {
      const resposta = await fetch(
        "/api/simular-vagas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            perfil,
            preferencias: {
              ...preferencias,
              periodicidadeSalario: "mensal"
            }
          }),
          cache: "no-store"
        }
      );

      const retorno: unknown = await resposta.json();

      if (
        !resposta.ok ||
        !objeto(retorno) ||
        retorno.ok !== true ||
        retorno.vagasSimuladas !== true ||
        retorno.buscaExecutada !== false ||
        !Array.isArray(retorno.vagasClassificadas)
      ) {
        throw new Error("Resposta invalida do simulador.");
      }

      const resultados: Vaga[] =
        retorno.vagasClassificadas.filter(vagaValida);

      if (resultados.length !== 5) {
        throw new Error("Vagas incompletas.");
      }

      resultados.sort(
        (a, b) => b.pontuacao - a.pontuacao
      );

      setVagas(resultados);
    } catch {
      setErro(
        "Nao foi possivel carregar as vagas. " +
        "Confira se o n8n esta aguardando o teste."
      );
    } finally {
      setCarregando(false);
    }
  }

  function alternarSelecao(id: string) {
    setSelecionadas(atuais =>
      atuais.includes(id)
        ? atuais.filter(item => item !== id)
        : [...atuais, id]
    );
  }


  async function exportarExcel() {
    if (!selecionadas.length || exportando) return;

    setExportando(true);
    setErroExportacao("");

    try {
      const escolhidas = vagas.filter(
        vaga => selecionadas.includes(vaga.id)
      );

      const resposta = await fetch(
        "/api/exportar-vagas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            vagas: escolhidas
          })
        }
      );

      if (
        !resposta.ok ||
        !resposta.headers.get("content-type")
          ?.includes("spreadsheetml.sheet")
      ) {
        throw new Error("Falha ao gerar arquivo.");
      }

      const blob = await resposta.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "luna-vagas-selecionadas.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setErroExportacao(
        "Nao foi possivel exportar as vagas."
      );
    } finally {
      setExportando(false);
    }
  }

  const exibidas = filtro === "todas"
    ? vagas
    : vagas.filter(
        vaga => vaga.prioridade === filtro
      );

  return (
    <section className="mt-8 rounded-2xl border border-indigo-400/30 bg-[#0B1020] p-6">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-400">
        Etapa 03 - Simulacao
      </p>

      <h2 className="text-2xl font-bold text-white">
        Vagas compativeis com seu perfil
      </h2>

      <p className="mt-3 text-sm text-slate-400">
        Teste nosso algoritmo com cinco vagas ficticias.
        As pontuacoes nao representam chances de
        contratacao.
      </p>

      <button
        type="button"
        onClick={simular}
        disabled={carregando}
        className="mt-6 w-full rounded-xl bg-indigo-500 px-5 py-4 font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
      >
        {carregando
          ? "Classificando vagas..."
          : "Simular busca de vagas"}
      </button>

      {erro && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-500/10 p-4 text-red-300"
        >
          {erro}
        </p>
      )}

      {vagas.length > 0 && (
        <div className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-semibold text-white">
              {exibidas.length} de {vagas.length} vagas
            </p>

            <label className="text-sm text-slate-300">
              Prioridade
              <select
                value={filtro}
                onChange={(evento) =>
                  setFiltro(
                    evento.target.value as
                      "todas" | Prioridade
                  )
                }
                className="ml-3 rounded-lg border border-white/20 bg-[#151C30] p-2 text-white"
              >
                <option value="todas">Todas</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baixa">Baixa</option>
              </select>
            </label>
          </div>

          <p
            role="status"
            className="text-sm font-medium text-indigo-200"
          >
            {selecionadas.length} vagas selecionadas
            para exportacao.
          </p>


          <div className="space-y-3">
            <button
              type="button"
              disabled={
                selecionadas.length === 0 || exportando
              }
              onClick={exportarExcel}
              className="w-full rounded-xl border border-indigo-400/50 bg-indigo-500/20 px-5 py-4 font-semibold text-indigo-200 transition hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {exportando
                ? "Gerando Excel..."
                : `Baixar ${selecionadas.length} vagas em Excel (.xlsx)`}
            </button>

            {erroExportacao && (
              <p role="alert" className="text-sm text-red-300">
                {erroExportacao}
              </p>
            )}
          </div>

          {exibidas.map((vaga) => (
            <article
              key={vaga.id}
              className="rounded-2xl border border-white/10 bg-[#151C30] p-5"
            >
              <label className="mb-5 inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-indigo-200">
                <input
                  type="checkbox"
                  checked={selecionadas.includes(vaga.id)}
                  onChange={() => alternarSelecao(vaga.id)}
                  className="h-5 w-5 accent-indigo-500"
                />
                Selecionar vaga
              </label>

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-indigo-300">
                    {vaga.empresa}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-white">
                    {vaga.cargo}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {vaga.localizacao} · {vaga.modalidade}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-300">
                    {vaga.pontuacao}/100
                  </p>

                  <p className="mt-1 text-xs uppercase text-slate-400">
                    Prioridade {vaga.prioridade}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-indigo-400"
                  style={{
                    width: `${vaga.pontuacao}%`
                  }}
                />
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-white">
                  Por que esta pontuacao?
                </h4>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                  {vaga.motivos.map((motivo, indice) => (
                    <li key={indice}>{motivo}</li>
                  ))}
                </ul>
              </div>

              {vaga.pendencias.length > 0 && (
                <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
                  <h4 className="font-semibold text-amber-200">
                    Informacoes a verificar
                  </h4>

                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-100/80">
                    {vaga.pendencias.map(
                      (pendencia, indice) => (
                        <li key={indice}>
                          {pendencia}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              <p className="mt-5 text-xs text-slate-500">
                Vaga ficticia. Nao disponivel para candidatura.
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
