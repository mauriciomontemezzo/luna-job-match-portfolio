import { analisarCargo } from "./compatibilidadeVagas";

const testes = [
  {
    vaga: "Senior Frontend Developer",
    desejado: "Desenvolvedor Frontend",
    esperado: "direta"
  },
  {
    vaga: "Backend Developer",
    desejado: "Desenvolvedor Backend",
    esperado: "direta"
  },
  {
    vaga: "Technical Support Specialist",
    desejado: "Especialista em Suporte Tecnico",
    esperado: "direta"
  },
  {
    vaga: "AI Automation Engineer",
    desejado: "Engenheiro de Automacao com IA",
    esperado: "direta"
  },
  {
    vaga: "Frontend Developer",
    desejado: "Backend Developer",
    esperado: "nao_identificada"
  },
  {
    vaga: "AI Automation Engineer",
    desejado: "Automation Specialist",
    esperado: "nao_identificada"
  },
  {
    vaga: "Frontend Developer",
    desejado: "Backend Developer, Desenvolvedor Frontend",
    esperado: "direta"
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = analisarCargo(
    teste.vaga,
    teste.desejado
  );

  const passou = resultado.relevancia === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.vaga,
    "| desejado:", teste.desejado,
    "| esperado:", teste.esperado,
    "| obtido:", resultado.relevancia
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
