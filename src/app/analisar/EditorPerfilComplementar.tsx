"use client";

type Idioma = {
  idioma: string;
  nivel: string;
};

type Formacao = {
  titulo: string;
  instituicao: string;
  ano: string;
};

function texto(valor: unknown): string {
  if (typeof valor === "string") return valor;
  if (typeof valor === "number") return String(valor);
  return "";
}

function normalizarIdiomas(valor: unknown): Idioma[] {
  if (!Array.isArray(valor)) return [];

  return valor.flatMap((item): Idioma[] => {
    if (typeof item === "string") {
      return [{ idioma: item, nivel: "" }];
    }

    if (!item || typeof item !== "object" ||
        Array.isArray(item)) {
      return [];
    }

    const registro = item as Record<string, unknown>;

    if (typeof registro.idioma === "string") {
      return [{
        idioma: registro.idioma,
        nivel: texto(
          registro.nivel ??
          registro["nível"] ??
          registro.niveis
        )
      }];
    }

    return Object.entries(registro)
      .filter(([, nivel]) => typeof nivel === "string")
      .map(([idioma, nivel]) => ({
        idioma,
        nivel: texto(nivel)
      }));
  });
}

function normalizarFormacoes(valor: unknown): Formacao[] {
  if (!Array.isArray(valor)) return [];

  return valor.map((item): Formacao => {
    if (typeof item === "string") {
      return {
        titulo: item,
        instituicao: "",
        ano: ""
      };
    }

    const registro =
      item && typeof item === "object" &&
      !Array.isArray(item)
        ? item as Record<string, unknown>
        : {};

    return {
      titulo: texto(
        registro.titulo ??
        registro.curso ??
        registro.tipo
      ),
      instituicao: texto(
        registro.instituicao ??
        registro["instituição"]
      ),
      ano: texto(
        registro.ano ??
        registro.conclusao ??
        registro["conclusão"]
      )
    };
  });
}

const estiloCampo =
  "w-full rounded-xl border border-white/20 " +
  "bg-[#0B1020] p-3 text-white";

export default function EditorPerfilComplementar({
  idiomas,
  formacao,
  onIdiomasChange,
  onFormacaoChange
}: {
  idiomas?: unknown[];
  formacao?: unknown[];
  onIdiomasChange: (valores: Idioma[]) => void;
  onFormacaoChange: (valores: Formacao[]) => void;
}) {
  const linguas = normalizarIdiomas(idiomas);
  const cursos = normalizarFormacoes(formacao);

  function editarIdioma(
    indice: number,
    campo: keyof Idioma,
    valor: string
  ) {
    onIdiomasChange(
      linguas.map((item, i) =>
        i === indice
          ? { ...item, [campo]: valor }
          : item
      )
    );
  }

  function editarFormacao(
    indice: number,
    campo: keyof Formacao,
    valor: string
  ) {
    onFormacaoChange(
      cursos.map((item, i) =>
        i === indice
          ? { ...item, [campo]: valor }
          : item
      )
    );
  }

  return (
    <div className="mt-8 space-y-8">

      <section className="rounded-2xl border border-indigo-400/20 bg-[#0B1020] p-5">
        <h4 className="text-xl font-semibold text-indigo-200">
          Revisar idiomas
        </h4>

        <p className="mt-2 text-sm text-slate-400">
          Informe somente os idiomas e niveis que
          voce realmente possui.
        </p>

        <div className="mt-5 space-y-4">
          {linguas.map((item, indice) => (
            <div
              key={indice}
              className="rounded-xl border border-white/10 bg-[#151C30] p-4"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm">
                    Idioma
                  </span>
                  <input
                    value={item.idioma}
                    onChange={(e) =>
                      editarIdioma(
                        indice,
                        "idioma",
                        e.target.value
                      )
                    }
                    className={estiloCampo}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm">
                    Nivel declarado
                  </span>
                  <input
                    value={item.nivel}
                    onChange={(e) =>
                      editarIdioma(
                        indice,
                        "nivel",
                        e.target.value
                      )
                    }
                    placeholder="Ex: Intermediario B2"
                    className={estiloCampo}
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() =>
                  onIdiomasChange(
                    linguas.filter((_, i) => i !== indice)
                  )
                }
                className="mt-4 rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-300"
              >
                Remover idioma
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            onIdiomasChange([
              ...linguas,
              { idioma: "", nivel: "" }
            ])
          }
          className="mt-5 w-full rounded-xl border border-indigo-400/30 px-4 py-3 font-semibold text-indigo-200"
        >
          + Adicionar idioma
        </button>
      </section>

      <section className="rounded-2xl border border-indigo-400/20 bg-[#0B1020] p-5">
        <h4 className="text-xl font-semibold text-indigo-200">
          Revisar formacao academica
        </h4>

        <p className="mt-2 text-sm text-slate-400">
          Confira cursos, instituicoes e datas.
        </p>

        <div className="mt-5 space-y-4">
          {cursos.map((item, indice) => (
            <div
              key={indice}
              className="rounded-xl border border-white/10 bg-[#151C30] p-4"
            >
              {([
                ["titulo", "Curso ou titulo"],
                ["instituicao", "Instituicao"],
                ["ano", "Ano ou situacao"]
              ] as const).map(([campo, rotulo]) => (
                <label key={campo} className="mb-4 block">
                  <span className="mb-2 block text-sm">
                    {rotulo}
                  </span>

                  <input
                    value={item[campo]}
                    onChange={(e) =>
                      editarFormacao(
                        indice,
                        campo,
                        e.target.value
                      )
                    }
                    className={estiloCampo}
                  />
                </label>
              ))}

              <button
                type="button"
                onClick={() =>
                  onFormacaoChange(
                    cursos.filter((_, i) => i !== indice)
                  )
                }
                className="rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-300"
              >
                Remover formacao
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            onFormacaoChange([
              ...cursos,
              {
                titulo: "",
                instituicao: "",
                ano: ""
              }
            ])
          }
          className="mt-5 w-full rounded-xl border border-indigo-400/30 px-4 py-3 font-semibold text-indigo-200"
        >
          + Adicionar formacao
        </button>
      </section>
    </div>
  );
}
