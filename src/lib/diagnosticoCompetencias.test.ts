import {
  diagnosticarCompetencias
} from "./diagnosticoCompetencias";

const testes = [
  {
    nome: "Comparacao completa",
    vaga: {
      requisitos: ["Python", "SQL", "Docker"]
    },
    declaradas: ["Python"],
    confirmar: ["SQL"],
    situacao: "analisado",
    contagens: [1, 1, 1]
  },
  {
    nome: "Sem campo requisitos",
    vaga: {
      descricao: "Experience with Python"
    },
    declaradas: ["Python"],
    confirmar: [],
    situacao: "indisponivel",
    contagens: null
  },
  {
    nome: "Lista vazia",
    vaga: { requisitos: [] },
    declaradas: ["Python"],
    confirmar: [],
    situacao: "sem_requisitos",
    contagens: null
  },
  {
    nome: "Competencias pendentes",
    vaga: { requisitos: ["n8n"] },
    declaradas: [],
    confirmar: ["n8n"],
    situacao: "analisado",
    contagens: [0, 1, 0]
  },
  {
    nome: "Perfil sem competencias",
    vaga: { requisitos: ["Python"] },
    declaradas: [],
    confirmar: [],
    situacao: "analisado",
    contagens: [0, 0, 1]
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = diagnosticarCompetencias(
    teste.vaga,
    teste.declaradas,
    teste.confirmar
  );

  const contagens = resultado.resultado
    ? [
        resultado.resultado.identificadas,
        resultado.resultado.pendentes,
        resultado.resultado.naoIdentificadas
      ]
    : null;

  const passou =
    resultado.situacao === teste.situacao &&
    JSON.stringify(contagens) ===
      JSON.stringify(teste.contagens);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| situacao:", resultado.situacao,
    "| contagens:",
    contagens?.join("/") ?? "indisponivel"
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO: ${aprovados}/${testes.length}`
);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
