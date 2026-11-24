import { verificarEquivalenciaCargo } from "./equivalenciasCargos";

export type RelevanciaCargo =
  | "direta"
  | "parcial"
  | "nao_identificada";

export type AnaliseCargo = {
  relevancia: RelevanciaCargo;
  termosEncontrados: string[];
  motivo: string;
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const termosGenericos = new Set([
  "de", "da", "do", "em", "para",
  "the", "and", "for", "with",
  "remote", "remoto", "online",
  "data", "dados", "python",
  "developer", "desenvolvedor", "desenvolvedora",
  "automation", "automacao",
  "software", "engineer", "engineering",
  "engenheiro", "engenheira", "engenharia"
]);

export function analisarCargo(
  cargoVaga: string,
  cargosDesejados: string
): AnaliseCargo {
  const titulo = normalizar(cargoVaga);

  const cargos = cargosDesejados
    .split(/[,;\n]/)
    .map(normalizar)
    .filter(Boolean);

  if (!titulo || cargos.length === 0) {
    return {
      relevancia: "nao_identificada",
      termosEncontrados: [],
      motivo: "Informacoes insuficientes."
    };
  }

  for (const cargo of cargos) {
    if (` ${titulo} `.includes(` ${cargo} `)) {
      return {
        relevancia: "direta",
        termosEncontrados: cargo.split(" "),
        motivo: "O titulo contem o cargo desejado."
      };
    }
  }

  const equivalencias = cargos.map((cargo) =>
    verificarEquivalenciaCargo(titulo, cargo)
  );

  if (equivalencias.includes("direta")) {
    return {
      relevancia: "direta",
      termosEncontrados: [],
      motivo: "Cargo equivalente identificado."
    };
  }

  if (equivalencias.includes("parcial")) {
    return {
      relevancia: "parcial",
      termosEncontrados: [],
      motivo: "Cargo profissional relacionado identificado."
    };
  }

  const termosDesejados = [
    ...new Set(
      cargos
        .flatMap(cargo => cargo.split(" "))
        .filter(termo =>
          termo.length >= 3 &&
          !termosGenericos.has(termo)
        )
    )
  ];

  const termosTitulo = new Set(titulo.split(" "));

  const encontrados = termosDesejados.filter(
    termo => termosTitulo.has(termo)
  );

  if (encontrados.length > 0) {
    return {
      relevancia: "parcial",
      termosEncontrados: encontrados,
      motivo: "O titulo compartilha termos com o cargo desejado."
    };
  }

  return {
    relevancia: "nao_identificada",
    termosEncontrados: [],
    motivo: "Nenhuma correspondencia textual identificada."
  };
}
