"use client";

import PainelDiagnosticoV3 from "./PainelDiagnosticoV3";
import PainelSenioridadeV4 from "./PainelSenioridadeV4";
import PainelElegibilidadeV5 from "./PainelElegibilidadeV5";
import PainelAvaliacaoV6 from "./PainelAvaliacaoV6";
import ResumoAvaliacaoV6 from "./ResumoAvaliacaoV6";

import PainelExplicacaoV2 from "./PainelExplicacaoV2";
import { ordenarOportunidadesV2 } from "../../lib/ordenacaoOportunidadesV2";
import { classificarOportunidadeV2 } from "../../lib/classificacaoOportunidadesV2";

import PainelDiagnosticoProfissional from "./PainelDiagnosticoProfissional";
import { classificarOportunidade } from "../../lib/classificacaoOportunidades";


import { useState } from "react";
import PainelCompetencias from "./PainelCompetencias";
import { adaptarPerfilCompetencias } from "../../lib/adaptadorPerfilCompetencias";
import { diagnosticarCompetencias } from "../../lib/diagnosticoCompetencias";

import { ordenarVagas } from "../../lib/ordenarVagas";
import { calcularPrioridade } from "../../lib/prioridadeVagas";
import { calcularPontuacao } from "../../lib/pontuacaoVagas";
import { analisarGeografia } from "../../lib/analiseGeografica";
import { analisarTecnologias } from "../../lib/analiseTecnologias";
import { analisarCargo } from "../../lib/compatibilidadeVagas";
import { analisarSenioridade } from "../../lib/analiseSenioridade";
import { compararSenioridade } from "../../lib/compararSenioridade";

import type { Preferencias } from "./PreferenciasVagas";

type VagaReal = {
  id: string;
  cargo: string;
  empresa: string;
  localizacao: string;
  modalidade: string;
  linkCandidatura: string;
  fonte: string;
  descricao?: string;
  competenciasMencionadas?: string[];
};

function objeto(valor: unknown): valor is Record<string, unknown> {
  return valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor);
}

function vagaValida(valor: unknown): valor is VagaReal {
  return objeto(valor) &&
    typeof valor.id === "string" &&
    typeof valor.cargo === "string" &&
    typeof valor.empresa === "string" &&
    typeof valor.localizacao === "string" &&
    typeof valor.modalidade === "string" &&
    typeof valor.linkCandidatura === "string" &&
    typeof valor.fonte === "string" &&
    (
      valor.competenciasMencionadas === undefined ||
      (
        Array.isArray(valor.competenciasMencionadas) &&
        valor.competenciasMencionadas.every(
          (item) => typeof item === "string"
        )
      )
    );
}

export default function ResultadosReais({
  perfil,
  preferencias
}: {
  perfil: unknown;
  preferencias: Preferencias;
}) {
  const [versaoBusca, setVersaoBusca] = useState<"v1" | "v2">("v1");

  function alterarVersaoBusca(versao: "v1" | "v2") {
    if (carregando || exportando || versaoBusca === versao) return;

    setVersaoBusca(versao);
    setVagas([]);
    setSelecionadas([]);
    setPesquisado(false);
    setErro("");
    setErroExportacao("");
    setFiltroOportunidades("todas");
  }

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [pesquisado, setPesquisado] = useState(false);
  const [vagas, setVagas] = useState<VagaReal[]>([]);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [filtroOportunidades, setFiltroOportunidades] = useState<
    "todas" | "correspondencia_identificada" |
    "oportunidades_relacionadas" | "outras_oportunidades"
  >("todas");

  function alternarSelecao(id: string) {
    setSelecionadas((anteriores) =>
      anteriores.includes(id)
        ? anteriores.filter((item) => item !== id)
        : [...anteriores, id]
    );
  }


  async function buscar() {
    if (carregando) return;

    setCarregando(true);
    setErro("");
    setPesquisado(false);
    setVagas([]);
    setSelecionadas([]);

    try {
      const resposta = await fetch(
        versaoBusca === "v2"
          ? "/api/buscar-vagas-v2"
          : "/api/buscar-vagas",
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfil, preferencias }),
        cache: "no-store"
      });

      const dados: unknown = await resposta.json();

      if (
        !resposta.ok ||
        !objeto(dados) ||
        dados.ok !== true ||
        dados.buscaExecutada !== true ||
        dados.vagasSimuladas !== false ||
        !Array.isArray(dados.vagas) ||
        !dados.vagas.every(vagaValida)
      ) {
        throw new Error("Resposta invalida da busca real.");
      }

      setVagas(dados.vagas);
      setPesquisado(true);
    } catch {
      setErro("Nao foi possivel consultar as vagas reais.");
    } finally {
      setCarregando(false);
    }
  }


  const vagasAnalisadas = ordenarVagas(vagas.map((vaga) => ({
    ...vaga,
    analise: analisarCargo(vaga.cargo, preferencias.cargos),
    geografia: analisarGeografia(vaga.localizacao),
    tecnologias: analisarTecnologias(
      vaga.descricao ?? "",
      preferencias.tecnologias
    )
  })));

  const [exportando, setExportando] = useState(false);
  const [erroExportacao, setErroExportacao] = useState("");


  async function exportarSelecionadas() {
    if (exportando || selecionadas.length === 0) return;

    setExportando(true);
    setErroExportacao("");

    try {
      const escolhidas = vagasPriorizadas
        .filter((vaga) => selecionadas.includes(vaga.id))
        .map((vaga) => ({
          cargo: vaga.cargo,
          empresa: vaga.empresa,
          localizacao: vaga.localizacao,
          linkCandidatura: vaga.linkCandidatura,
          prioridade: vaga.prioridadeCalculada.prioridade,
          pontuacao: vaga.pontuacao.pontuacaoParcial,
          pontuacaoMaximaAvaliada:
            vaga.pontuacao.pontuacaoMaximaAvaliada,
          motivos: [
            "Pontuacao experimental parcial: " +
              vaga.pontuacao.pontuacaoParcial + "/" +
              vaga.pontuacao.pontuacaoMaximaAvaliada,
            "Relevancia do cargo: " + vaga.analise.relevancia,
            vaga.analise.motivo,
            "Tecnologias mencionadas: " +
              (vaga.tecnologias.encontradas.join(", ") || "nenhuma"),
            "Geografia: " + vaga.geografia.motivo,
            "Senioridade: " + vaga.senioridade.nivel,
            vaga.comparacaoSenioridade.motivo,
            ...vaga.pontuacao.criteriosPendentes.map(
              (criterio) => "Pendente: " + criterio
            ),
            ...(vaga.pontuacao.alertaGeografico
              ? ["Alerta: restricao geografica identificada"]
              : []),
            ...(vaga.comparacaoSenioridade.situacao ===
              "possivel_incompatibilidade"
              ? ["Alerta: possivel incompatibilidade de senioridade"]
              : [])
          ]
        }));

      const resposta = await fetch("/api/exportar-vagas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "real",
          vagas: escolhidas
        }),
        cache: "no-store"
      });

      if (!resposta.ok) {
        throw new Error("Falha ao gerar Excel.");
      }

      const arquivo = await resposta.blob();

      if (!arquivo.size) {
        throw new Error("Arquivo vazio.");
      }

      const url = URL.createObjectURL(arquivo);
      const link = document.createElement("a");

      link.href = url;
      link.download = "luna-vagas-reais-selecionadas.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setErroExportacao(
        "Nao foi possivel exportar as vagas selecionadas."
      );
    } finally {
      setExportando(false);
    }
  }

  const perfilCompetencias = adaptarPerfilCompetencias(perfil);

  const vagasPontuadas = vagasAnalisadas.map((vaga) => {
    const senioridade = analisarSenioridade(vaga.cargo);

    const comparacaoSenioridade = compararSenioridade(
      senioridade.nivel,
      preferencias.senioridade
    );

    return {
      ...vaga,
      diagnosticoCompetencias: diagnosticarCompetencias(
        vaga,
        perfilCompetencias.competenciasDeclaradas,
        perfilCompetencias.competenciasAConfirmar
      ),
      senioridade,
      comparacaoSenioridade,
      pontuacao: calcularPontuacao({
      relevanciaCargo: vaga.analise.relevancia,
      tecnologiasEncontradas: vaga.tecnologias.totalEncontradas,
      tecnologiasDesejadas: vaga.tecnologias.totalDesejadas,
      situacaoGeografica: vaga.geografia.situacao,
      situacaoSenioridade:
        comparacaoSenioridade.situacao
      })
    };
  });

  const vagasPriorizadas = vagasPontuadas.map((vaga) => ({
    ...vaga,
    grupoOportunidade:
      versaoBusca === "v2"
        ? classificarOportunidadeV2(
            vaga.cargo,
            preferencias.cargos,
            vaga.competenciasMencionadas ?? []
          )
        : classificarOportunidade(
            vaga.cargo,
            preferencias.cargos
          ),
    prioridadeCalculada: calcularPrioridade({
      pontuacaoParcial:
        vaga.pontuacao.pontuacaoParcial,
      pontuacaoMaximaAvaliada:
        vaga.pontuacao.pontuacaoMaximaAvaliada,
      criteriosPendentes:
        vaga.pontuacao.criteriosPendentes,
      alertaGeografico:
        vaga.pontuacao.alertaGeografico,
      incompatibilidadeSenioridade:
        vaga.comparacaoSenioridade.situacao ===
        "possivel_incompatibilidade"
    })
  }));

  const vagasOrdenadas =
    versaoBusca === "v2"
      ? ordenarOportunidadesV2(vagasPriorizadas)
      : vagasPriorizadas;

  const ContainerDiagnosticos =
    versaoBusca === "v2" ? "details" : "div";

  const vagasFiltradas =
    filtroOportunidades === "todas"
      ? vagasOrdenadas
      : vagasOrdenadas.filter(
          (vaga) =>
            vaga.grupoOportunidade === filtroOportunidades
        );

  return (
    <section className="mt-8 rounded-2xl border border-emerald-400/30 bg-[#0B1020] p-6">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
        Busca real de empregos
      </p>

      <h2 className="text-2xl font-bold text-white">
        Vagas reais de emprego
      </h2>

      <p className="mt-3 text-sm text-slate-400">
        Resultados da Remotive. Ainda nao classificados por
        compatibilidade ou elegibilidade geografica.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => alterarVersaoBusca("v1")}
          disabled={carregando || exportando}
          aria-pressed={versaoBusca === "v1"}
          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
            versaoBusca === "v1"
              ? "border-emerald-400 bg-emerald-500/15 text-emerald-200"
              : "border-white/10 bg-white/5 text-slate-300"
          }`}
        >
          V1 - Busca padrao
        </button>

        <button
          type="button"
          onClick={() => alterarVersaoBusca("v2")}
          disabled={carregando || exportando}
          aria-pressed={versaoBusca === "v2"}
          className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
            versaoBusca === "v2"
              ? "border-sky-400 bg-sky-500/15 text-sky-200"
              : "border-white/10 bg-white/5 text-slate-300"
          }`}
        >
          V2 - Competencias (experimental)
        </button>
      </div>

      <button
        type="button"
        onClick={buscar}
        disabled={carregando}
        className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-4 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {carregando ? "Buscando vagas..." : "Buscar vagas reais"}
      </button>

      {erro && (
        <p role="alert" className="mt-4 text-red-300">
          {erro}
        </p>
      )}

      {pesquisado && (
        <p role="status" className="mt-5 text-emerald-300">
          {vagas.length} vagas encontradas.
        </p>
      )}


      {pesquisado && (
        <p className="mt-3 text-sm text-slate-300">
          {selecionadas.length} vaga(s) selecionada(s).
        </p>
      )}

      {pesquisado && (
        <div className="mt-4">
          <button
            type="button"
            onClick={exportarSelecionadas}
            disabled={exportando || selecionadas.length === 0}
            className="w-full rounded-xl bg-indigo-600 px-5 py-4 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {exportando
              ? "Gerando Excel..."
              : `Exportar ${selecionadas.length} vaga(s) para Excel`}
          </button>

          {erroExportacao && (
            <p role="alert" className="mt-3 text-sm text-red-300">
              {erroExportacao}
            </p>
          )}
        </div>
      )}

      {pesquisado && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              grupo: "correspondencia_identificada",
              titulo: "Correspondencia identificada"
            },
            {
              grupo: "oportunidades_relacionadas",
              titulo: "Oportunidades relacionadas"
            },
            {
              grupo: "outras_oportunidades",
              titulo: "Outras oportunidades"
            }
          ].map((item) => (
            <div
              key={item.grupo}
              className="rounded-xl border border-white/10 bg-[#151C30] p-4"
            >
              <p className="text-sm text-slate-300">
                {item.titulo}
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {vagasPriorizadas.filter(
                  (vaga) => vaga.grupoOportunidade === item.grupo
                ).length}
              </p>
            </div>
          ))}
        </div>
      )}

      {pesquisado && (
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { valor: "todas", titulo: "Todas" },
            {
              valor: "correspondencia_identificada",
              titulo: "Correspondencia"
            },
            {
              valor: "oportunidades_relacionadas",
              titulo: "Relacionadas"
            },
            {
              valor: "outras_oportunidades",
              titulo: "Outras"
            }
          ].map((item) => (
            <button
              key={item.valor}
              type="button"
              onClick={() =>
                setFiltroOportunidades(
                  item.valor as typeof filtroOportunidades
                )
              }
              aria-pressed={filtroOportunidades === item.valor}
              className={
                filtroOportunidades === item.valor
                  ? "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-lg border border-white/20 px-4 py-2 text-sm text-slate-300"
              }
            >
              {item.titulo}
            </button>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm text-slate-400">
        Exibindo {vagasFiltradas.length} de {vagasPriorizadas.length} vagas.
      </p>

      {pesquisado &&
        vagasFiltradas.length === 0 &&
        vagasPriorizadas.length > 0 && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5"
          >
            <p className="font-semibold text-amber-200">
              Nenhuma vaga nesta categoria
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Nenhuma oportunidade encontrada com esta classificacao.
              Experimente selecionar outra categoria ou revisar os
              cargos desejados.
            </p>
            <button
              type="button"
              onClick={() => setFiltroOportunidades("todas")}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Mostrar todas as vagas
            </button>
          </div>
        )}

      <div className="mt-6 space-y-4">
        {vagasFiltradas.map((vaga) => (
          <article
            key={vaga.id}
            className="rounded-xl border border-white/10 bg-[#151C30] p-5"
          >
            <label className="mb-4 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={selecionadas.includes(vaga.id)}
                onChange={() => alternarSelecao(vaga.id)}
                className="h-5 w-5 accent-emerald-500"
              />
              <span className="text-sm font-semibold text-emerald-300">
                Selecionar esta vaga
              </span>
            </label>

            <p className="text-sm text-emerald-300">
              {vaga.empresa}
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              {vaga.cargo}
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              {vaga.localizacao} - {vaga.modalidade}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Fonte: {vaga.fonte}
            </p>

            <ContainerDiagnosticos
              className={
                versaoBusca === "v2"
                  ? "mt-4 rounded-xl border border-white/15 p-3"
                  : ""
              }
            >
              {versaoBusca === "v2" && (
                <summary className="cursor-pointer rounded-lg p-3 text-white hover:bg-white/5">
                  <span className="block font-semibold text-indigo-200">
                    Ver diagnosticos completos
                  </span>

                  <span className="mt-3 flex flex-wrap gap-3">
                    <span className="rounded-lg border border-indigo-400/30 px-3 py-2 text-sm">
                      Pontuacao:{" "}
                      <strong>
                        {vaga.pontuacao.pontuacaoParcial}/
                        {vaga.pontuacao.pontuacaoMaximaAvaliada}
                      </strong>
                    </span>

                    <span className="rounded-lg border border-indigo-400/30 px-3 py-2 text-sm">
                      Prioridade:{" "}
                      <strong>
                        {{
                          alta: "Alta",
                          media: "Media",
                          baixa: "Baixa",
                          revisao_necessaria: "Revisao necessaria"
                        }[vaga.prioridadeCalculada.prioridade]}
                      </strong>
                    </span>
                  </span>

                  <ResumoAvaliacaoV6
                    cargoVaga={vaga.cargo}
                    cargosDesejados={preferencias.cargos}
                    localizacao={vaga.localizacao}
                    experiencias={
                      perfil &&
                      typeof perfil === "object" &&
                      !Array.isArray(perfil) &&
                      Array.isArray(
                        (perfil as { experiencias?: unknown })
                          .experiencias
                      )
                        ? (perfil as { experiencias: unknown[] })
                            .experiencias
                        : []
                    }
                  />
                </summary>
              )}

            <div className="mt-4 rounded-lg border border-white/10 p-3">
              <p className="text-sm font-semibold text-emerald-300">
                Relevancia do cargo: {
                  vaga.analise.relevancia === "direta"
                    ? "Direta"
                    : vaga.analise.relevancia === "parcial"
                      ? "Parcial"
                      : "Nao identificada"
                }
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {vaga.analise.motivo}
              </p>
            </div>

            <PainelDiagnosticoProfissional
              cargoVaga={vaga.cargo}
              cargosDesejados={preferencias.cargos}
            />

              {versaoBusca === "v2" && (
                <PainelDiagnosticoV3
                  cargoVaga={vaga.cargo}
                  cargosDesejados={preferencias.cargos}
                />
              )}

            {versaoBusca === "v2" && (
              <PainelExplicacaoV2
                cargoVaga={vaga.cargo}
                cargosDesejados={preferencias.cargos}
                competenciasMencionadas={
                  vaga.competenciasMencionadas ?? []
                }
              />
            )}


              {versaoBusca === "v2" && (
                <PainelSenioridadeV4
                  cargoVaga={vaga.cargo}
                  experiencias={
                    perfil &&
                    typeof perfil === "object" &&
                    !Array.isArray(perfil) &&
                    Array.isArray(
                      (perfil as { experiencias?: unknown })
                        .experiencias
                    )
                      ? (perfil as { experiencias: unknown[] })
                          .experiencias
                      : []
                  }
                />
              )}


              {versaoBusca === "v2" && (
                <PainelElegibilidadeV5
                  cargoVaga={vaga.cargo}
                  cargosDesejados={preferencias.cargos}
                  localizacao={vaga.localizacao}
                  experiencias={
                    perfil &&
                    typeof perfil === "object" &&
                    !Array.isArray(perfil) &&
                    Array.isArray(
                      (perfil as { experiencias?: unknown })
                        .experiencias
                    )
                      ? (perfil as { experiencias: unknown[] })
                          .experiencias
                      : []
                  }
                />
              )}


              {versaoBusca === "v2" && (
                <PainelAvaliacaoV6
                  cargoVaga={vaga.cargo}
                  cargosDesejados={preferencias.cargos}
                  localizacao={vaga.localizacao}
                  experiencias={
                    perfil &&
                    typeof perfil === "object" &&
                    !Array.isArray(perfil) &&
                    Array.isArray(
                      (perfil as { experiencias?: unknown })
                        .experiencias
                    )
                      ? (perfil as { experiencias: unknown[] })
                          .experiencias
                      : []
                  }
                />
              )}

<PainelCompetencias
              diagnostico={vaga.diagnosticoCompetencias}
              perfilSemCompetencias={
                perfilCompetencias.competenciasDeclaradas.length === 0 &&
                perfilCompetencias.competenciasAConfirmar.length === 0
              }
            />

            {vaga.tecnologias.totalDesejadas > 0 && (
              <div className="mt-4 rounded-lg border border-white/10 p-3">
                <p className="text-sm font-semibold text-emerald-300">
                  Tecnologias mencionadas na vaga
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  {vaga.tecnologias.encontradas.join(", ") || "Nenhuma"}
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  Nao identificadas na descricao: {
                    vaga.tecnologias.naoIdentificadas.join(", ") ||
                    "Nenhuma"
                  }
                </p>
              </div>
            )}

            {vaga.competenciasMencionadas !== undefined && (
              <section className="mt-4 rounded-lg border border-sky-400/20 bg-sky-400/5 p-4">
                <p className="text-sm font-semibold text-sky-300">
                  Competencias mencionadas no anuncio
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Identificacao automatica de tecnologias citadas na descricao.
                  A mencao nao confirma que sejam requisitos obrigatorios.
                </p>

                {vaga.competenciasMencionadas.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {vaga.competenciasMencionadas.map((competencia) => (
                      <span
                        key={competencia}
                        className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200"
                      >
                        {competencia}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">
                    Nenhuma competencia do catalogo identificada.
                  </p>
                )}
              </section>
            )}

            <div className="mt-4 rounded-lg border border-white/10 p-3">
              <p className="text-sm font-semibold text-emerald-300">
                Elegibilidade geografica
              </p>

              <p className="mt-2 text-sm text-white">
                {{
                  brasil_mencionado: "Brasil mencionado",
                  regiao_compativel: "Regiao que inclui o Brasil",
                  global: "Anuncio global",
                  restricao_identificada: "Restricao identificada",
                  localizacao_limitada: "Localizacao limitada",
                  nao_confirmada: "Nao confirmada"
                }[vaga.geografia.situacao]}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {vaga.geografia.motivo}
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-white/10 p-4">
              <p className="text-sm font-semibold text-emerald-300">
                Analise de senioridade
              </p>

              <p className="mt-2 text-sm text-white">
                Nivel identificado: {{
                  junior: "Junior",
                  pleno: "Pleno",
                  senior: "Senior",
                  lideranca: "Lideranca",
                  nao_identificada: "Nao identificado"
                }[vaga.senioridade.nivel]}
              </p>

              <p className="mt-2 text-sm text-slate-300">
                Preferencia: {preferencias.senioridade}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {vaga.comparacaoSenioridade.motivo}
              </p>

              {vaga.comparacaoSenioridade.situacao ===
                "possivel_incompatibilidade" && (
                <p
                  role="status"
                  className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200"
                >
                  Atencao: a vaga indica senioridade superior
                  ao nivel desejado. Verifique os requisitos.
                </p>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-indigo-400/30 p-4">
              <p className="text-sm font-semibold text-indigo-300">
                Prioridade da oportunidade
              </p>

              <p className="mt-2 text-lg font-bold text-white">
                {{
                  alta: "Alta",
                  media: "Media",
                  baixa: "Baixa",
                  revisao_necessaria: "Revisao necessaria"
                }[vaga.prioridadeCalculada.prioridade]}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {vaga.prioridadeCalculada.motivo}
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-indigo-400/30 p-4">
              <p className="text-sm font-semibold text-indigo-300">
                Pontuacao parcial experimental
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {vaga.pontuacao.pontuacaoParcial}/
                {vaga.pontuacao.pontuacaoMaximaAvaliada}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Pontos obtidos nos criterios avaliaveis.
                Nao representa chance de contratacao.
              </p>

              <p className="mt-3 text-sm text-slate-300">
                Criterios pendentes: {
                  vaga.pontuacao.criteriosPendentes.join("; ")
                }
              </p>

              {vaga.pontuacao.alertaGeografico && (
                <p
                  role="status"
                  className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200"
                >
                  Atencao: restricao geografica explicita
                  identificada. Verifique as condicoes
                  antes de se candidatar.
                </p>
              )}
            </div>

            </ContainerDiagnosticos>

            {vaga.linkCandidatura.startsWith("https://") && (
              <a
                href={vaga.linkCandidatura}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-emerald-300 underline"
              >
                Ver vaga original
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
