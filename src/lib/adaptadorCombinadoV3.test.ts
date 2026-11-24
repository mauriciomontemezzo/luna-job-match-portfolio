import {
  adaptarDiagnosticoCombinadoV3
} from "./adaptadorCombinadoV3";

let aprovados = 0;
let total = 0;

function verificar(nome: string, condicao: boolean) {
  total++;

  console.log(
    condicao ? "OK" : "FALHOU",
    "|",
    nome
  );

  if (condicao) aprovados++;
}

const multiplos = adaptarDiagnosticoCombinadoV3(
  "English Teacher",
  "English Teacher, Data Analyst, IT Support Specialist"
);

verificar(
  "Analisa multiplas carreiras",
  multiplos.length === 3
);

verificar(
  "Preserva ordem dos cargos",
  multiplos.map((item) => item.cargoDesejado).join("|") ===
    "English Teacher|Data Analyst|IT Support Specialist"
);

verificar(
  "Preserva classificacao original",
  multiplos.every(
    (item) =>
      item.classificacaoOriginal === item.classificacao
  )
);

verificar(
  "Classificacoes expandidas validas",
  multiplos.every((item) =>
    ["direta", "parcial", "nao_identificada"].includes(
      item.classificacaoExpandida
    )
  )
);

verificar(
  "Identifica origem da expansao",
  multiplos.every((item) =>
    ["original", "catalogo_expansao"].includes(
      item.origemExpansao
    )
  )
);

verificar(
  "Revisao semantica booleana",
  multiplos.every(
    (item) => typeof item.revisaoSemantica === "boolean"
  )
);

verificar(
  "Nao altera pontuacao",
  multiplos.every(
    (item) => item.alteraPontuacao === false
  )
);

verificar(
  "Nao altera prioridade",
  multiplos.every(
    (item) => item.alteraPrioridade === false
  )
);

const vazio = adaptarDiagnosticoCombinadoV3(
  "English Teacher",
  ""
);

verificar(
  "Aceita lista vazia",
  vazio.length === 0
);

const educacao = adaptarDiagnosticoCombinadoV3(
  "English Tutor",
  "English Language Instructor"
);

verificar(
  "Nao promove expansao educacional a direta",
  educacao.length === 1 &&
    educacao[0].classificacaoExpandida !== "direta"
);

console.log(
  `RESULTADO_COMBINADO: ${aprovados}/${total}`
);

if (aprovados !== total) {
  process.exitCode = 1;
}
