import {
  compararCompetencias
} from "./comparadorCompetencias";

const testes = [
  {
    nome: "Competencias identificadas",
    requisitos: ["Python", "SQL"],
    declaradas: ["python", "sql"],
    confirmar: [],
    esperado: [2, 0, 0]
  },
  {
    nome: "Confirmacao pendente",
    requisitos: ["Python", "n8n"],
    declaradas: ["Python"],
    confirmar: ["n8n"],
    esperado: [1, 1, 0]
  },
  {
    nome: "Competencia nao identificada",
    requisitos: ["Docker"],
    declaradas: ["Python"],
    confirmar: [],
    esperado: [0, 0, 1]
  },
  {
    nome: "Acentos e maiusculas",
    requisitos: ["Automação"],
    declaradas: ["AUTOMACAO"],
    confirmar: [],
    esperado: [1, 0, 0]
  },
  {
    nome: "Requisitos duplicados",
    requisitos: ["Python", "python", " SQL "],
    declaradas: ["Python"],
    confirmar: [],
    esperado: [1, 0, 1]
  },
  {
    nome: "Entrada vazia",
    requisitos: [],
    declaradas: [],
    confirmar: [],
    esperado: [0, 0, 0]
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = compararCompetencias(
    teste.requisitos,
    teste.declaradas,
    teste.confirmar
  );

  const obtido = [
    resultado.identificadas,
    resultado.pendentes,
    resultado.naoIdentificadas
  ];

  const passou =
    JSON.stringify(obtido) ===
    JSON.stringify(teste.esperado);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| obtido:", obtido.join("/"),
    "| esperado:", teste.esperado.join("/")
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO: ${aprovados}/${testes.length}`
);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
