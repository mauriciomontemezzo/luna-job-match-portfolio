"use client";

import { useState, type ChangeEvent } from "react";
import type { Preferencias } from "./PreferenciasVagas";

type Perfil = {
  resumo?: string;
  experiencias?: unknown[];
  competenciasDeclaradas?: unknown[];
  competenciasAConfirmar?: unknown[];
  idiomas?: unknown[];
  formacao?: unknown[];
  sugestoes?: unknown[];
  informacoesAusentes?: unknown[];
};

const CAMPOS = [
  "experiencias",
  "competenciasDeclaradas",
  "competenciasAConfirmar",
  "idiomas",
  "formacao",
  "sugestoes",
  "informacoesAusentes"
] as const;

function objeto(
  valor: unknown
): valor is Record<string, unknown> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
  );
}

function validarDocumento(valor: unknown): Perfil {
  if (
    !objeto(valor) ||
    valor.versao !== 1 ||
    !objeto(valor.perfil)
  ) {
    throw new Error("Formato de perfil nao reconhecido.");
  }

  const dados = valor.perfil;

  if (
    typeof dados.resumo !== "string" ||
    !dados.resumo.trim() ||
    dados.resumo.length > 10000
  ) {
    throw new Error("Resumo profissional invalido.");
  }

  const perfil: Perfil = {
    resumo: dados.resumo
  };

  for (const campo of CAMPOS) {
    const lista = dados[campo];

    if (
      !Array.isArray(lista) ||
      lista.length > 100 ||
      !lista.every(
        item =>
          typeof item === "string" ||
          objeto(item)
      )
    ) {
      throw new Error(
        `Campo invalido no perfil: ${campo}`
      );
    }

    perfil[campo] = lista;
  }

  return perfil;
}


function obterPreferencias(
  conteudo: unknown
): Preferencias | null {
  if (
    !objeto(conteudo) ||
    !("preferencias" in conteudo)
  ) {
    return null;
  }

  const p = conteudo.preferencias;

  if (!objeto(p)) {
    throw new Error("Preferencias invalidas.");
  }

  const campos = [
    "cargos",
    "localizacoes",
    "modalidade",
    "senioridade",
    "tecnologias",
    "salarioMinimo",
    "moeda",
    "idiomaVagas"
  ] as const;

  for (const campo of campos) {
    if (
      typeof p[campo] !== "string" ||
      p[campo].length > 2000
    ) {
      throw new Error(
        `Preferencia invalida: ${campo}`
      );
    }
  }

  if (
    !["remoto", "hibrido", "presencial", "indiferente"]
      .includes(p.modalidade as string) ||
    !["indiferente", "estagio", "junior", "pleno", "senior"]
      .includes(p.senioridade as string) ||
    !["BRL", "USD", "EUR"]
      .includes(p.moeda as string) ||
    !["ambos", "portugues", "ingles"]
      .includes(p.idiomaVagas as string)
  ) {
    throw new Error("Opcoes de preferencias invalidas.");
  }

  const salario = p.salarioMinimo as string;

  if (
    salario.trim() &&
    (!Number.isFinite(Number(salario)) ||
      Number(salario) <= 0)
  ) {
    throw new Error("Salario minimo invalido.");
  }

  return {
    cargos: p.cargos as string,
    localizacoes: p.localizacoes as string,
    modalidade: p.modalidade as string,
    senioridade: p.senioridade as string,
    tecnologias: p.tecnologias as string,
    salarioMinimo: salario,
    moeda: p.moeda as string,
    idiomaVagas: p.idiomaVagas as string
  };
}

export default function ImportarPerfil({
  onImport,
  disabled = false
}: {
  onImport: (
    perfil: Perfil,
    preferencias: Preferencias | null
  ) => void;
  disabled?: boolean;
}) {
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  async function importar(
    evento: ChangeEvent<HTMLInputElement>
  ) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";

    if (!arquivo) return;

    setErro("");
    setAviso("");

    try {
      if (
        !arquivo.name.toLowerCase().endsWith(".json") ||
        arquivo.size === 0 ||
        arquivo.size > 1024 * 1024
      ) {
        throw new Error(
          "Selecione um JSON de ate 1 MB."
        );
      }

      const conteudo: unknown = JSON.parse(
        await arquivo.text()
      );

      const perfil = validarDocumento(conteudo);

      const preferencias = obterPreferencias(conteudo);
      onImport(perfil, preferencias);

      setAviso(
        "Perfil recuperado! Revise e confirme novamente."
      );
    } catch (falha) {
      setErro(
        falha instanceof Error
          ? falha.message
          : "Nao foi possivel importar o perfil."
      );
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-indigo-400/20 bg-[#0B1020] p-5">
      <h3 className="font-semibold text-indigo-200">
        Ja possui um perfil salvo?
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        Recupere seu arquivo JSON sem analisar
        novamente o curriculo.
      </p>

      <label className="mt-4 block cursor-pointer rounded-xl border border-indigo-400/40 px-4 py-3 text-center font-semibold text-indigo-200 hover:bg-indigo-500/10">
        Importar perfil salvo

        <input
          type="file"
          accept=".json,application/json"
          onChange={importar}
          disabled={disabled}
          className="sr-only"
          aria-label="Importar perfil JSON"
        />
      </label>

      {erro && (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {erro}
        </p>
      )}

      {aviso && (
        <p role="status" className="mt-3 text-sm text-emerald-300">
          {aviso}
        </p>
      )}
    </section>
  );
}
