"use client";

import ResultadosVagas from "./ResultadosVagas";
import ResultadosReais from "./ResultadosReais";

import { useState } from "react";

export type Preferencias = {
  cargos: string;
  localizacoes: string;
  modalidade: string;
  senioridade: string;
  tecnologias: string;
  salarioMinimo: string;
  moeda: string;
  idiomaVagas: string;
};

const inicial: Preferencias = {
  cargos: "",
  localizacoes: "",
  modalidade: "remoto",
  senioridade: "indiferente",
  tecnologias: "",
  salarioMinimo: "",
  moeda: "USD",
  idiomaVagas: "ambos"
};

const campos: {
  chave: keyof Preferencias;
  titulo: string;
  exemplo: string;
}[] = [
  {
    chave: "cargos",
    titulo: "Cargos desejados",
    exemplo: "Ex: AI Agent Developer, Analista de Dados"
  },
  {
    chave: "localizacoes",
    titulo: "Paises ou regioes",
    exemplo: "Ex: Brasil, Estados Unidos, Europa"
  },
  {
    chave: "tecnologias",
    titulo: "Tecnologias de interesse",
    exemplo: "Ex: Python, n8n, Power BI"
  }
];

const estilo =
  "w-full rounded-xl border border-white/20 " +
  "bg-[#0B1020] p-3 text-white";

export default function PreferenciasVagas({
  perfil,
  preferenciasIniciais
}: {
  perfil: unknown;
  preferenciasIniciais?: Preferencias | null;
}) {
  const [dados, setDados] = useState<Preferencias>(() => ({
    ...inicial,
    ...(preferenciasIniciais ?? {})
  }));
  const [confirmado, setConfirmado] = useState(false);
  const [testandoN8n, setTestandoN8n] = useState(false);
  const [resultadoTeste, setResultadoTeste] =
    useState<"nenhum" | "sucesso" | "erro">("nenhum");


  function atualizar(
    chave: keyof Preferencias,
    valor: string
  ) {
    setDados((anterior) => ({
      ...anterior,
      [chave]: valor
    }));
    setConfirmado(false);
    setResultadoTeste("nenhum");
  }

  const salarioValido =
    !dados.salarioMinimo.trim() ||
    (
      Number.isFinite(Number(dados.salarioMinimo)) &&
      Number(dados.salarioMinimo) > 0
    );

  return (
    <section className="mt-8 rounded-2xl border border-indigo-400/30 bg-[#151C30] p-6">

      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-400">
        Etapa 02 - Oportunidades
      </p>

      <h2 className="text-2xl font-bold">
        Que tipo de emprego voce procura?
      </h2>

      <p className="mt-3 text-sm text-slate-400">
        Personalize suas preferencias para preparar
        a futura busca inteligente de vagas.
      </p>

      <div className="mt-8 space-y-5">

        {campos.map((campo) => (
          <label key={campo.chave} className="block">
            <span className="mb-2 block text-sm font-semibold">
              {campo.titulo}
            </span>

            <input
              value={dados[campo.chave]}
              onChange={(e) =>
                atualizar(campo.chave, e.target.value)
              }
              placeholder={campo.exemplo}
              className={estilo}
            />
          </label>
        ))}

        <div className="grid gap-5 md:grid-cols-2">

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              Modalidade
            </span>

            <select
              value={dados.modalidade}
              onChange={(e) =>
                atualizar("modalidade", e.target.value)
              }
              className={estilo}
            >
              <option value="remoto">Remoto</option>
              <option value="hibrido">Hibrido</option>
              <option value="presencial">Presencial</option>
              <option value="indiferente">Indiferente</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              Senioridade
            </span>

            <select
              value={dados.senioridade}
              onChange={(e) =>
                atualizar("senioridade", e.target.value)
              }
              className={estilo}
            >
              <option value="indiferente">Indiferente</option>
              <option value="estagio">Estagio</option>
              <option value="junior">Junior</option>
              <option value="pleno">Pleno</option>
              <option value="senior">Senior</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              Salario minimo desejado
            </span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={dados.salarioMinimo}
              onChange={(e) =>
                atualizar("salarioMinimo", e.target.value)
              }
              placeholder="Valor mensal"
              className={estilo}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              Moeda
            </span>

            <select
              value={dados.moeda}
              onChange={(e) =>
                atualizar("moeda", e.target.value)
              }
              className={estilo}
            >
              <option value="USD">Dolar (USD)</option>
              <option value="BRL">Real (BRL)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold">
              Idioma das vagas
            </span>

            <select
              value={dados.idiomaVagas}
              onChange={(e) =>
                atualizar("idiomaVagas", e.target.value)
              }
              className={estilo}
            >
              <option value="ambos">Portugues e ingles</option>
              <option value="portugues">Portugues</option>
              <option value="ingles">Ingles</option>
            </select>
          </label>

        </div>
      </div>

      {!salarioValido && (
        <p role="alert" className="mt-4 text-sm text-red-300">
          Informe um salario positivo ou deixe vazio.
        </p>
      )}

      <button
        type="button"
        disabled={!dados.cargos.trim() || !salarioValido}
        onClick={() => setConfirmado(true)}
        className="mt-8 w-full rounded-xl bg-indigo-500 px-5 py-4 font-semibold text-white disabled:opacity-50"
      >
        Confirmar preferencias de vagas
      </button>

      {confirmado && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
        >
          Preferencias confirmadas nesta sessao.
          Elas ainda nao foram salvas nem enviadas
          para o sistema de busca de vagas.
        </div>
      )}

      {confirmado && (
        <button
          type="button"
          onClick={() => {
            const conteudo = JSON.stringify({
              versao: 1,
              exportadoEm: new Date().toISOString(),
              perfil,
              preferencias: {
                ...dados,
                periodicidadeSalario: "mensal"
              }
            }, null, 2);

            const blob = new Blob(
              [conteudo],
              { type: "application/json" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download =
              "luna-perfil-e-preferencias.json";

            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(
              () => URL.revokeObjectURL(url),
              1000
            );
          }}
          className="mt-4 w-full rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-5 py-4 font-semibold text-indigo-200 hover:bg-indigo-500/30"
        >
          Baixar perfil e preferencias (JSON)
        </button>
      )}


      {confirmado && (
        <>
          <ResultadosVagas
            perfil={perfil}
            preferencias={dados}
          />
          <ResultadosReais
            perfil={perfil}
            preferencias={dados}
          />
        </>
      )}

      {/* TESTE_CONEXAO_N8N_V1 */}
      {confirmado && (
        <div className="mt-6">
          <button
            type="button"
            disabled={testandoN8n}
            onClick={async () => {
              setTestandoN8n(true);
              setResultadoTeste("nenhum");

              try {
                const resposta = await fetch(
                  "/api/buscar-vagas",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      perfil,
                      preferencias: {
                        ...dados,
                        periodicidadeSalario: "mensal"
                      }
                    })
                  }
                );

                const retorno: {
                  ok?: boolean;
                  n8nConfirmou?: boolean;
                  buscaExecutada?: boolean;
                } = await resposta.json();

                if (
                  !resposta.ok ||
                  retorno.ok !== true ||
                  retorno.n8nConfirmou !== true ||
                  retorno.buscaExecutada !== false
                ) {
                  throw new Error(
                    "Resposta inesperada do n8n."
                  );
                }

                setResultadoTeste("sucesso");
              } catch {
                setResultadoTeste("erro");
              } finally {
                setTestandoN8n(false);
              }
            }}
            className="w-full rounded-xl bg-indigo-500 px-5 py-4 font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
          >
            {testandoN8n
              ? "Testando conexao..."
              : "Testar conexao com a LUNA Job Hunter"}
          </button>

          {resultadoTeste === "sucesso" && (
            <p
              role="status"
              className="mt-4 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-300"
            >
              Conexao confirmada! O n8n recebeu
              seu perfil e suas preferencias.
              Nenhuma busca de vagas foi executada.
            </p>
          )}

          {resultadoTeste === "erro" && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-500/10 p-4 text-sm text-red-300"
            >
              Falha na conexao. Verifique se o
              n8n esta aguardando o evento de teste.
            </p>
          )}
        </div>
      )}

    </section>
  );
}
