import { analisarEstruturaProfissional } from "./estruturaProfissional";

const testes = [
  {
    cargo: "Frontend Developer",
    funcao: "desenvolvimento",
    especialidade: "frontend",
    tecnologias: []
  },
  {
    cargo: "Backend Developer",
    funcao: "desenvolvimento",
    especialidade: "backend",
    tecnologias: []
  },
  {
    cargo: "Python Developer",
    funcao: "desenvolvimento",
    especialidade: null,
    tecnologias: ["python"]
  },
  {
    cargo: "Data Analyst",
    funcao: "analise",
    especialidade: "dados",
    tecnologias: []
  },
  {
    cargo: "React Frontend Developer",
    funcao: "desenvolvimento",
    especialidade: "frontend",
    tecnologias: ["react"]
  },
  {
    cargo: "Desenvolvedor Front End",
    funcao: "desenvolvimento",
    especialidade: "frontend",
    tecnologias: []
  },
  {
    cargo: "Engenheiro de Dados",
    funcao: "engenharia",
    especialidade: "dados",
    tecnologias: []
  },
  {
    cargo: "Machine Learning Engineer",
    funcao: "engenharia",
    especialidade: "machine_learning",
    tecnologias: []
  },
  {
    cargo: "English Teacher",
    funcao: "ensino",
    especialidade: null,
    tecnologias: []
  },
  {
    cargo: "IT Support Specialist",
    funcao: "suporte",
    especialidade: null,
    tecnologias: []
  },
  {
    cargo: "Python SQL Data Analyst",
    funcao: "analise",
    especialidade: "dados",
    tecnologias: ["python", "sql"]
  },
  {
    cargo: "",
    funcao: null,
    especialidade: null,
    tecnologias: []
  }
];

let aprovados = 0;

for (const teste of testes) {
  const resultado = analisarEstruturaProfissional(
    teste.cargo
  );

  const passou =
    resultado.funcao === teste.funcao &&
    resultado.especialidade === teste.especialidade &&
    JSON.stringify(resultado.tecnologias) ===
      JSON.stringify(teste.tecnologias);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.cargo || "(vazio)",
    "| funcao:", resultado.funcao,
    "| especialidade:", resultado.especialidade,
    "| tecnologias:", resultado.tecnologias.join(", ")
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
