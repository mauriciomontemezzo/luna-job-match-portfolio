import { analisarEstruturaProfissional } from "./estruturaProfissional";

const testes = [
  {
    cargo: "Frontend / Backend Developer",
    funcoes: ["desenvolvimento"],
    especialidades: ["frontend", "backend"],
    tecnologias: []
  },
  {
    cargo: "Developer / Data Analyst",
    funcoes: ["desenvolvimento", "analise"],
    especialidades: ["dados"],
    tecnologias: []
  },
  {
    cargo: "Python / React Developer",
    funcoes: ["desenvolvimento"],
    especialidades: [],
    tecnologias: ["python", "react"]
  },
  {
    cargo: "Machine Learning / Data Engineer",
    funcoes: ["engenharia"],
    especialidades: ["dados", "machine_learning"],
    tecnologias: []
  },
  {
    cargo: "English Teacher / Python Instructor",
    funcoes: ["ensino"],
    especialidades: [],
    tecnologias: ["python"]
  },
  {
    cargo: "React Frontend / Python Backend Developer",
    funcoes: ["desenvolvimento"],
    especialidades: ["frontend", "backend"],
    tecnologias: ["python", "react"]
  },
  {
    cargo: "Unknown Position",
    funcoes: [],
    especialidades: [],
    tecnologias: []
  },
  {
    cargo: "",
    funcoes: [],
    especialidades: [],
    tecnologias: []
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = analisarEstruturaProfissional(
    teste.cargo
  );

  const passou =
    JSON.stringify(resultado.funcoes) ===
      JSON.stringify(teste.funcoes) &&
    JSON.stringify(resultado.especialidades) ===
      JSON.stringify(teste.especialidades) &&
    JSON.stringify(resultado.tecnologias) ===
      JSON.stringify(teste.tecnologias);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.cargo || "(vazio)",
    "| funcoes:", resultado.funcoes.join(", "),
    "| especialidades:",
      resultado.especialidades.join(", "),
    "| tecnologias:",
      resultado.tecnologias.join(", ")
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
