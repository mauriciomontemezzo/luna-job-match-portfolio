
"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import PreferenciasVagas, {
  type Preferencias
} from "./PreferenciasVagas";
import ImportarPerfil from "./ImportarPerfil";
import EditorPerfilComplementar from "./EditorPerfilComplementar";

const LIMITE_MB = 10;

type Analise = {
  resumo?: string;
  experiencias?: unknown[];
  competenciasDeclaradas?: unknown[];
  competenciasAConfirmar?: unknown[];
  idiomas?: unknown[];
  formacao?: unknown[];
  sugestoes?: unknown[];
  informacoesAusentes?: unknown[];
};

function legivel(valor: unknown): string {
  if (typeof valor === "string") return valor;
  if (typeof valor === "number") return String(valor);

  if (Array.isArray(valor)) {
    return valor.map(legivel).filter(Boolean).join("; ");
  }

  if (valor && typeof valor === "object") {
    return Object.entries(valor)
      .map(([campo, dado]) => `${campo}: ${legivel(dado)}`)
      .join(" | ");
  }

  return "";
}

function rotulo(campo: string): string {
  const separado = campo.replace(/([a-z])([A-Z])/g, "$1 $2");
  return separado.charAt(0).toUpperCase() + separado.slice(1);
}

function Secao({
  titulo,
  itens,
  tags = false
}: {
  titulo: string;
  itens?: unknown[];
  tags?: boolean;
}) {
  const lista = Array.isArray(itens) ? itens : [];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#151C30] p-6">
      <h3 className="mb-5 text-xl font-semibold text-white">
        {titulo}
      </h3>

      {lista.length === 0 ? (
        <p className="text-sm text-slate-400">
          Nenhuma informação identificada.
        </p>
      ) : tags ? (
        <div className="flex flex-wrap gap-2">
          {lista.map((item, indice) => (
            <span
              key={indice}
              className="rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200"
            >
              {legivel(item)}
            </span>
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {lista.map((item, indice) => (
            <li
              key={indice}
              className="rounded-xl border border-white/5 bg-white/5 p-4 text-sm leading-7 text-slate-200"
            >
              {item &&
              typeof item === "object" &&
              !Array.isArray(item) ? (
                <div className="space-y-2">
                  {Object.entries(item).map(([campo, valor]) => (
                    <p key={campo} className="break-words">
                      <span className="font-semibold text-indigo-300">
                        {rotulo(campo)}:
                      </span>{" "}
                      {legivel(valor)}
                    </p>
                  ))}
                </div>
              ) : (
                legivel(item)
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}


function EditorExperiencias({
  itens,
  onChange
}: {
  itens?: unknown[];
  onChange: (itens: unknown[]) => void;
}) {
  const experiencias = Array.isArray(itens) ? itens : [];

  function atualizar(
    indice: number,
    campo: string,
    valor: string | string[]
  ) {
    const atual = experiencias[indice];

    const base =
      atual &&
      typeof atual === "object" &&
      !Array.isArray(atual)
        ? atual as Record<string, unknown>
        : {};

    const novas = experiencias.map((item, i) =>
      i === indice
        ? { ...base, [campo]: valor }
        : item
    );

    onChange(novas);
  }

  return (
    <section className="mt-8 rounded-2xl border border-indigo-400/20 bg-[#0B1020] p-5">
      <h4 className="text-xl font-semibold text-indigo-200">
        Revisar experiencias profissionais
      </h4>

      <p className="mt-2 text-sm text-slate-400">
        Corrija empresas, cargos, periodos e atividades.
      </p>

      <div className="mt-5 space-y-6">
        {experiencias.map((item, indice) => {
          const exp =
            item &&
            typeof item === "object" &&
            !Array.isArray(item)
              ? item as Record<string, unknown>
              : {};

          const atividades = Array.isArray(exp.atividades)
            ? exp.atividades.map(
                (v) => typeof v === "string" ? v : ""
              ).join("\n")
            : typeof exp.atividades === "string"
              ? exp.atividades
              : "";

          return (
            <div
              key={indice}
              className="rounded-xl border border-white/10 bg-[#151C30] p-4"
            >
              <h5 className="mb-4 font-semibold">
                Experiencia {indice + 1}
              </h5>

              {(["empresa", "cargo", "periodo"] as const)
                .map((campo) => (
                  <label
                    key={campo}
                    className="mb-4 block"
                  >
                    <span className="mb-2 block text-sm capitalize text-slate-300">
                      {campo}
                    </span>

                    <input
                      value={
                        typeof exp[campo] === "string"
                          ? exp[campo] as string
                          : ""
                      }
                      onChange={(e) =>
                        atualizar(
                          indice,
                          campo,
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/20 bg-[#0B1020] p-3 text-white"
                    />
                  </label>
                ))}

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Atividades (uma por linha)
                </span>

                <textarea
                  rows={6}
                  value={atividades}
                  onChange={(e) =>
                    atualizar(
                      indice,
                      "atividades",
                      e.target.value === ""
                        ? []
                        : e.target.value.split("\n")
                    )
                  }
                  className="w-full rounded-xl border border-white/20 bg-[#0B1020] p-3 text-white"
                />
              </label>

              <button
                type="button"
                onClick={() =>
                  onChange(
                    experiencias.filter(
                      (_, i) => i !== indice
                    )
                  )
                }
                className="mt-4 rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-300"
              >
                Remover experiencia
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          onChange([
            ...experiencias,
            {
              empresa: "",
              cargo: "",
              periodo: "",
              atividades: []
            }
          ])
        }
        className="mt-5 w-full rounded-xl border border-indigo-400/30 px-4 py-3 font-semibold text-indigo-200 hover:bg-indigo-500/10"
      >
        + Adicionar experiencia
      </button>
    </section>
  );
}


function pendenciasPerfil(analise: Analise): string[] {
  const pendencias: string[] = [];

  function preenchido(valor: unknown): boolean {
    return (
      typeof valor === "string" &&
      valor.trim().length > 0
    );
  }

  if (!preenchido(analise.resumo)) {
    pendencias.push("Preencha o resumo profissional.");
  }

  const competencias =
    analise.competenciasDeclaradas ?? [];

  if (competencias.some(item => !preenchido(item))) {
    pendencias.push("Corrija competencias vazias.");
  }

  (analise.experiencias ?? []).forEach((item, i) => {
    const exp =
      item && typeof item === "object" &&
      !Array.isArray(item)
        ? item as Record<string, unknown>
        : {};

    if (
      !preenchido(exp.empresa) ||
      !preenchido(exp.cargo)
    ) {
      pendencias.push(
        `Complete empresa e cargo da experiencia ${i + 1}.`
      );
    }
  });

  (analise.idiomas ?? []).forEach((item, i) => {
    const idioma =
      item && typeof item === "object" &&
      !Array.isArray(item)
        ? item as Record<string, unknown>
        : {};

    if ("idioma" in idioma || "nivel" in idioma) {
      if (
        !preenchido(idioma.idioma) ||
        !preenchido(idioma.nivel)
      ) {
        pendencias.push(
          `Complete o idioma ${i + 1}.`
        );
      }
    } else if (
      !Object.entries(idioma).length ||
      Object.entries(idioma).some(
        ([nome, nivel]) =>
          !nome.trim() || !preenchido(nivel)
      )
    ) {
      pendencias.push(
        `Revise o idioma ${i + 1}.`
      );
    }
  });

  (analise.formacao ?? []).forEach((item, i) => {
    const titulo =
      typeof item === "string"
        ? item
        : item && typeof item === "object" &&
          !Array.isArray(item)
          ? (
              item as Record<string, unknown>
            ).titulo ??
            (
              item as Record<string, unknown>
            ).tipo ??
            (
              item as Record<string, unknown>
            ).curso
          : undefined;

    if (!preenchido(titulo)) {
      pendencias.push(
        `Informe o titulo da formacao ${i + 1}.`
      );
    }
  });

  if ((analise.competenciasAConfirmar ?? []).length) {
    pendencias.push(
      "Existem competencias que ainda precisam de confirmacao."
    );
  }

  return pendencias;
}

export default function Analisar() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [novaCompetencia, setNovaCompetencia] = useState("");
  const [revisaoConfirmada, setRevisaoConfirmada] = useState(false);
  const [preferenciasImportadas, setPreferenciasImportadas] =
    useState<Preferencias | null>(null);

  function selecionarArquivo(
    evento: ChangeEvent<HTMLInputElement>
  ) {
    const selecionado = evento.target.files?.[0];

    setArquivo(null);
    setErro("");
    setAnalise(null);
    setPreferenciasImportadas(null);
    setRevisaoConfirmada(false);

    if (!selecionado) return;

    if (
      !selecionado.name.toLowerCase().endsWith(".pdf") ||
      (selecionado.type &&
        selecionado.type !== "application/pdf")
    ) {
      setErro("Selecione um arquivo PDF válido.");
      evento.target.value = "";
      return;
    }

    if (
      selecionado.size === 0 ||
      selecionado.size > LIMITE_MB * 1024 * 1024
    ) {
      setErro("O PDF deve ter até 10 MB.");
      evento.target.value = "";
      return;
    }

    setArquivo(selecionado);
  }

  async function enviarCurriculo() {
    if (!arquivo || enviando) return;

    setEnviando(true);
    setErro("");
    setAnalise(null);
    setRevisaoConfirmada(false);

    try {
      const formulario = new FormData();
      formulario.append("curriculo", arquivo);

      const resposta = await fetch("/api/analisar-curriculo", {
        method: "POST",
        body: formulario,
        cache: "no-store"
      });

      const dados = await resposta.json();

      if (
        !resposta.ok ||
        dados.ok !== true ||
        dados.analiseGerada !== true ||
        !dados.analise ||
        typeof dados.analise !== "object" ||
        Array.isArray(dados.analise)
      ) {
        throw new Error(
          dados.mensagem || "Falha na análise do currículo."
        );
      }

      setAnalise(dados.analise);

    } catch (falha) {
      setErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível analisar o currículo."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B1020] text-white">
      <div className="mx-auto max-w-5xl px-6 py-8">

        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="text-xl font-bold">
            <span className="text-indigo-400">✦</span>{" "}
            LUNA <span className="text-indigo-400">Job Match</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            Voltar ao início
          </Link>
        </header>

        <section className="py-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Etapa 01 — Currículo
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Descubra seu próximo passo.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-slate-400">
            Envie seu currículo e descubra como suas
            experiências e competências podem abrir
            novas oportunidades profissionais.
          </p>

          <div className="mt-10 rounded-3xl border border-white/10 bg-[#151C30] p-6 md:p-10">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-3xl text-indigo-300">
              ↑
            </div>

            <h2 className="text-2xl font-bold">
              Selecione seu currículo
            </h2>

            <p className="mt-3 text-slate-400">
              Formato PDF, até 10 MB.
            </p>

            <label className="mt-8 block cursor-pointer rounded-2xl border-2 border-dashed border-indigo-400/40 bg-indigo-500/5 p-10 text-center transition hover:border-indigo-400">
              <span className="block text-lg font-semibold text-indigo-300">
                Escolher arquivo PDF
              </span>

              <span className="mt-2 block text-sm text-slate-400">
                Clique para selecionar no seu Mac
              </span>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={selecionarArquivo}
                disabled={enviando}
                className="sr-only"
                aria-label="Selecionar currículo em PDF"
              />
            </label>

            <ImportarPerfil
              disabled={enviando}
              onImport={(perfil, preferencias) => {
                setAnalise(perfil);
                setPreferenciasImportadas(preferencias);
                setArquivo(null);
                setErro("");
                setNovaCompetencia("");
                setRevisaoConfirmada(false);
              }}
            />

            {arquivo && (
              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <p className="font-semibold text-emerald-300">
                  ✓ Arquivo selecionado!
                </p>

                <p className="mt-2 break-all text-sm">
                  {arquivo.name}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {erro && (
              <p
                role="alert"
                className="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-300"
              >
                {erro}
              </p>
            )}

            {arquivo && (
              <button
                type="button"
                onClick={enviarCurriculo}
                disabled={enviando}
                className="mt-6 w-full rounded-xl bg-indigo-500 px-5 py-4 font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
              >
                {enviando
                  ? "A LUNA está analisando seu currículo..."
                  : "Analisar meu currículo"}
              </button>
            )}

            <p className="mt-6 text-xs text-slate-500">
              Ambiente de desenvolvimento local.
              Utilize arquivos fictícios nos testes.
              O n8n pode armazenar dados nas execuções.
            </p>
          </div>

          {analise && (
            <div className="mt-12 space-y-6">

              <div
                role="status"
                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5"
              >
                <p className="font-semibold text-emerald-300">
                  ✓ Análise preliminar concluída!
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  A LUNA identificou as informações abaixo.
                  Revise os dados antes de utilizá-los
                  para buscar oportunidades.
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
                  Seu perfil profissional
                </p>

                <h2 className="text-3xl font-bold">
                  Resultado da análise
                </h2>
              </div>

              <section className="rounded-2xl border border-white/10 bg-[#151C30] p-6">
                <h3 className="mb-4 text-xl font-semibold">
                  Resumo profissional
                </h3>

                <p className="leading-8 text-slate-300">
                  {analise.resumo || "Resumo não identificado."}
                </p>
              </section>

              <Secao
                titulo="Experiências profissionais"
                itens={analise.experiencias}
              />

              <Secao
                titulo="Competências identificadas"
                itens={analise.competenciasDeclaradas}
                tags
              />

              <Secao
                titulo="Competências a confirmar"
                itens={analise.competenciasAConfirmar}
                tags
              />

              <div className="grid gap-6 md:grid-cols-2">
                <Secao
                  titulo="Idiomas"
                  itens={analise.idiomas}
                />

                <Secao
                  titulo="Formação acadêmica"
                  itens={analise.formacao}
                />
              </div>

              <Secao
                titulo="Sugestões de melhoria"
                itens={analise.sugestoes}
              />

              <Secao
                titulo="Informações ausentes"
                itens={analise.informacoesAusentes}
              />

              <section className="rounded-2xl border border-indigo-400/20 bg-[#151C30] p-6">
                <h3 className="text-xl font-bold text-indigo-200">
                  Revisar meu perfil
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Corrija o resumo e as competencias identificadas pela IA.
                </p>

                <label className="mt-6 block text-sm font-semibold">
                  Resumo profissional
                </label>

                <textarea
                  value={analise.resumo ?? ""}
                  onChange={(evento) => {
                    setAnalise({
                      ...analise,
                      resumo: evento.target.value
                    });
                    setRevisaoConfirmada(false);
                  }}
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-white/20 bg-[#0B1020] p-4 text-white"
                />

                <h4 className="mt-6 font-semibold">
                  Competencias declaradas
                </h4>

                <div className="mt-3 space-y-3">
                  {(analise.competenciasDeclaradas ?? []).map(
                    (competencia, indice) => (
                      <div key={indice} className="flex gap-2">
                        <input
                          aria-label={`Competencia ${indice + 1}`}
                          value={String(competencia ?? "")}
                          onChange={(evento) => {
                            const atualizadas = [
                              ...(analise.competenciasDeclaradas ?? [])
                            ];
                            atualizadas[indice] = evento.target.value;

                            setAnalise({
                              ...analise,
                              competenciasDeclaradas: atualizadas
                            });
                            setRevisaoConfirmada(false);
                          }}
                          className="min-w-0 flex-1 rounded-xl border border-white/20 bg-[#0B1020] p-3 text-white"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setAnalise({
                              ...analise,
                              competenciasDeclaradas:
                                (analise.competenciasDeclaradas ?? [])
                                  .filter((_, i) => i !== indice)
                            });
                            setRevisaoConfirmada(false);
                          }}
                          className="rounded-xl border border-red-400/30 px-3 text-red-300"
                        >
                          Remover
                        </button>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <input
                    value={novaCompetencia}
                    onChange={(evento) =>
                      setNovaCompetencia(evento.target.value)
                    }
                    placeholder="Nova competencia"
                    className="min-w-0 flex-1 rounded-xl border border-white/20 bg-[#0B1020] p-3 text-white"
                  />

                  <button
                    type="button"
                    disabled={!novaCompetencia.trim()}
                    onClick={() => {
                      const nova = novaCompetencia.trim();
                      if (!nova) return;

                      setAnalise({
                        ...analise,
                        competenciasDeclaradas: [
                          ...(analise.competenciasDeclaradas ?? []),
                          nova
                        ]
                      });

                      setNovaCompetencia("");
                      setRevisaoConfirmada(false);
                    }}
                    className="rounded-xl bg-indigo-500 px-4 py-3 font-semibold disabled:opacity-50"
                  >
                    Adicionar
                  </button>
                </div>

                <EditorExperiencias
                  itens={analise.experiencias}
                  onChange={(novas) => {
                    setAnalise({
                      ...analise,
                      experiencias: novas
                    });
                    setRevisaoConfirmada(false);
                  }}
                />

                <EditorPerfilComplementar
                  idiomas={analise.idiomas}
                  formacao={analise.formacao}
                  onIdiomasChange={(valores) => {
                    setAnalise({
                      ...analise,
                      idiomas: valores
                    });
                    setRevisaoConfirmada(false);
                  }}
                  onFormacaoChange={(valores) => {
                    setAnalise({
                      ...analise,
                      formacao: valores
                    });
                    setRevisaoConfirmada(false);
                  }}
                />

                <section className="mt-8 rounded-2xl border border-indigo-400/30 bg-[#0B1020] p-6">
                  <h3 className="text-xl font-bold text-indigo-200">
                    Confirmacao do perfil profissional
                  </h3>

                  <p className="mt-3 text-sm text-slate-400">
                    Confira as informacoes antes de continuar.
                    Esta confirmacao nao verifica a veracidade
                    dos dados e ainda nao os salva.
                  </p>

                  {pendenciasPerfil(analise).length > 0 ? (
                    <div
                      role="alert"
                      className="mt-5 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4"
                    >
                      <p className="font-semibold text-amber-200">
                        Informacoes pendentes
                      </p>

                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-100">
                        {pendenciasPerfil(analise).map(
                          (item, indice) => (
                            <li key={indice}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-emerald-300">
                      ✓ Campos essenciais preenchidos.
                      Confira se os dados estao corretos.
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={
                      pendenciasPerfil(analise).length > 0 ||
                      revisaoConfirmada
                    }
                    onClick={() => setRevisaoConfirmada(true)}
                    className="mt-6 w-full rounded-xl bg-indigo-500 px-5 py-4 font-semibold disabled:opacity-50"
                  >
                    {revisaoConfirmada
                      ? "Perfil revisado confirmado"
                      : "Confirmar meu perfil revisado"}
                  </button>

                  {revisaoConfirmada && (
                    <div className="mt-4 space-y-4">
                      <p
                        role="status"
                        className="text-emerald-300"
                      >
                        Perfil confirmado nesta sessao.
                        Voce pode baixar uma copia dos dados.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          const conteudo = JSON.stringify(
                            {
                              versao: 1,
                              confirmadoEm:
                                new Date().toISOString(),
                              perfil: analise
                            },
                            null,
                            2
                          );

                          const blob = new Blob(
                            [conteudo],
                            { type: "application/json" }
                          );

                          const url =
                            URL.createObjectURL(blob);

                          const link =
                            document.createElement("a");

                          link.href = url;
                          link.download =
                            "luna-perfil-revisado.json";

                          document.body.appendChild(link);
                          link.click();
                          link.remove();

                          setTimeout(
                            () => URL.revokeObjectURL(url),
                            1000
                          );
                        }}
                        className="w-full rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-5 py-4 font-semibold text-indigo-200 hover:bg-indigo-500/30"
                      >
                        Baixar copia do perfil revisado
                      </button>

                      <PreferenciasVagas
                        perfil={analise}
                        preferenciasIniciais={preferenciasImportadas}
                      />
                    </div>
                  )}
                </section>
              </section>

            </div>
          )}
        </section>

      </div>
    </main>
  );
}
