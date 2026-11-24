import { compararAnalisesProfissionais } from "./comparadorProfissional";

const testes = [
  {
    vaga: "Frontend Developer",
    desejado: "Backend Developer",
    relevancia: "nao_identificada",
    funcoes: ["desenvolvimento"],
    especialidades: []
  },
  {
    vaga: "React Frontend Developer",
    desejado: "Frontend Developer",
    relevancia: "direta",
    funcoes: ["desenvolvimento"],
    especialidades: ["frontend"]
  },
  {
    vaga: "Python Developer",
    desejado: "Python Engineer",
    relevancia: "parcial",
    funcoes: [],
    especialidades: []
  },
  {
    vaga: "Data Analyst",
    desejado: "Analista de Dados",
    relevancia: "direta",
    funcoes: ["analise"],
    especialidades: ["dados"]
  },
  {
    vaga: "AI Automation Engineer",
    desejado: "Automation Specialist",
    relevancia: "nao_identificada",
    funcoes: [],
    especialidades: ["automacao"]
  },
  {
    vaga: "Python / React Developer",
    desejado: "React Frontend Developer",
    relevancia: "parcial",
    funcoes: ["desenvolvimento"],
    especialidades: []
  },
  {
    vaga: "English Teacher",
    desejado: "Professor de Ingles",
    relevancia: "direta",
    funcoes: ["ensino"],
    especialidades: []
  },
  {
    vaga: "Unknown Position",
    desejado: "Data Analyst",
    relevancia: "nao_identificada",
    funcoes: [],
    especialidades: []
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = compararAnalisesProfissionais(
    teste.vaga,
    teste.desejado
  );

  const passou =
    resultado.analiseAtual.relevancia === teste.relevancia &&
    JSON.stringify(resultado.comparacao.funcoesEmComum) ===
      JSON.stringify(teste.funcoes) &&
    JSON.stringify(resultado.comparacao.especialidadesEmComum) ===
      JSON.stringify(teste.especialidades);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.vaga,
    "| desejado:", teste.desejado,
    "| relevancia:", resultado.analiseAtual.relevancia,
    "| funcoes:", resultado.comparacao.funcoesEmComum.join(", "),
    "| especialidades:",
      resultado.comparacao.especialidadesEmComum.join(", ")
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
