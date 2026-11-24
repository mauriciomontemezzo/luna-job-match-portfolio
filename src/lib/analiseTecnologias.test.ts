import { analisarTecnologias } from "./analiseTecnologias";

const testes = [
  {
    nome: "Python e SQL encontrados",
    descricao: "Experience with Python and SQL.",
    tecnologias: "Python, SQL, Power BI",
    encontradas: ["Python", "SQL"],
    naoIdentificadas: ["Power BI"]
  },
  {
    nome: "Descricao com HTML",
    descricao: "<p>We use <strong>Power BI</strong> and n8n.</p>",
    tecnologias: "Python, Power BI, n8n",
    encontradas: ["Power BI", "n8n"],
    naoIdentificadas: ["Python"]
  },
  {
    nome: "Sem correspondencia",
    descricao: "Experience in customer service.",
    tecnologias: "Python, SQL",
    encontradas: [],
    naoIdentificadas: ["Python", "SQL"]
  },
  {
    nome: "Maiusculas e minusculas",
    descricao: "PYTHON and sql development.",
    tecnologias: "Python, SQL",
    encontradas: ["Python", "SQL"],
    naoIdentificadas: []
  },
  {
    nome: "Sem tecnologias informadas",
    descricao: "Python developer wanted.",
    tecnologias: "",
    encontradas: [],
    naoIdentificadas: []
  }
];

let aprovados = 0;

for (const teste of testes) {
  const resultado = analisarTecnologias(
    teste.descricao,
    teste.tecnologias
  );

  const passou =
    JSON.stringify(resultado.encontradas) ===
      JSON.stringify(teste.encontradas) &&
    JSON.stringify(resultado.naoIdentificadas) ===
      JSON.stringify(teste.naoIdentificadas);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| encontradas:", resultado.encontradas.join(", ") || "nenhuma",
    "| nao identificadas:",
    resultado.naoIdentificadas.join(", ") || "nenhuma"
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
