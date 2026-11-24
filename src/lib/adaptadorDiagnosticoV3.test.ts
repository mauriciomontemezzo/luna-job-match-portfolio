import {
  adaptarDiagnosticoV3
} from "./adaptadorDiagnosticoV3";

let aprovados = 0;
let total = 0;

function verificar(
  nome: string,
  condicao: boolean
) {
  total++;

  console.log(
    condicao ? "OK" : "FALHOU",
    "|",
    nome
  );

  if (condicao) aprovados++;
}

const multiplos = adaptarDiagnosticoV3(
  "English Teacher",
  "English Teacher, Data Analyst, IT Support Specialist"
);

verificar(
  "Analisa tres carreiras",
  multiplos.length === 3
);

verificar(
  "Preserva ordem dos cargos",
  multiplos.map((item) => item.cargoDesejado).join("|") ===
    "English Teacher|Data Analyst|IT Support Specialist"
);

const duplicados = adaptarDiagnosticoV3(
  "English Teacher",
  "English Teacher, English Teacher, Data Analyst"
);

verificar(
  "Remove duplicados identicos",
  duplicados.length === 2
);

const vazio = adaptarDiagnosticoV3(
  "English Teacher",
  ""
);

verificar(
  "Aceita lista vazia",
  vazio.length === 0
);

const separadores = adaptarDiagnosticoV3(
  "English Teacher",
  "English Teacher;Data Analyst\nIT Support Specialist"
);

verificar(
  "Aceita diferentes separadores",
  separadores.length === 3
);

verificar(
  "Classificacoes validas",
  multiplos.every((item) =>
    [
      "direta",
      "parcial",
      "nao_identificada"
    ].includes(item.classificacao)
  )
);

verificar(
  "Origem identificada",
  multiplos.every(
    (item) => item.origem === "equivalencias_v3"
  )
);

verificar(
  "Nao altera pontuacao nem prioridade",
  multiplos.every(
    (item) =>
      item.alteraPontuacao === false &&
      item.alteraPrioridade === false
  )
);

verificar(
  "Todos resultados experimentais",
  multiplos.every(
    (item) => item.experimental === true
  )
);

verificar(
  "Preserva cargo da vaga",
  multiplos.every(
    (item) => item.cargoVaga === "English Teacher"
  )
);

console.log(
  `RESULTADO_ADAPTADOR: ${aprovados}/${total}`
);

if (aprovados !== total) {
  process.exitCode = 1;
}
