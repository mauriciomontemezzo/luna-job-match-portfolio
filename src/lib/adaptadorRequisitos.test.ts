import {
  adaptarRequisitos
} from "./adaptadorRequisitos";

const testes = [
  {
    nome: "Requisitos validos",
    vaga: { requisitos: ["Python", "SQL"] },
    disponivel: true,
    requisitos: ["Python", "SQL"]
  },
  {
    nome: "Descricao sem requisitos",
    vaga: { descricao: "Experience with Python" },
    disponivel: false,
    requisitos: []
  },
  {
    nome: "Requisitos ausentes",
    vaga: { cargo: "Developer" },
    disponivel: false,
    requisitos: []
  },
  {
    nome: "Itens invalidos",
    vaga: { requisitos: ["Python", null, 123, ""] },
    disponivel: true,
    requisitos: ["Python"]
  },
  {
    nome: "Duplicados e acentos",
    vaga: {
      requisitos: ["Automação", "automacao", "SQL"]
    },
    disponivel: true,
    requisitos: ["Automação", "SQL"]
  },
  {
    nome: "Entrada invalida",
    vaga: null,
    disponivel: false,
    requisitos: []
  },
  {
    nome: "Lista vazia",
    vaga: { requisitos: [] },
    disponivel: true,
    requisitos: []
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = adaptarRequisitos(teste.vaga);

  const passou =
    resultado.disponivel === teste.disponivel &&
    JSON.stringify(resultado.requisitos) ===
      JSON.stringify(teste.requisitos);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| disponivel:", resultado.disponivel,
    "| requisitos:", resultado.requisitos.join(", ")
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO: ${aprovados}/${testes.length}`
);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
