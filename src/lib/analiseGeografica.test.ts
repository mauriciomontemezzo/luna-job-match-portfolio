import { analisarGeografia } from "./analiseGeografica";

const testes = [
  {
    localizacao: "Brazil",
    esperado: "brasil_mencionado"
  },
  {
    localizacao: "Brasil - Remote",
    esperado: "brasil_mencionado"
  },
  {
    localizacao: "LATAM",
    esperado: "regiao_compativel"
  },
  {
    localizacao: "Latin America",
    esperado: "regiao_compativel"
  },
  {
    localizacao: "Worldwide",
    esperado: "global"
  },
  {
    localizacao: "Work from anywhere",
    esperado: "global"
  },
  {
    localizacao: "USA only",
    esperado: "restricao_identificada"
  },
  {
    localizacao: "US residents only",
    esperado: "restricao_identificada"
  },
  {
    localizacao: "USA, Canada, USA timezones",
    esperado: "localizacao_limitada"
  },
  {
    localizacao: "Remote",
    esperado: "nao_confirmada"
  },
  {
    localizacao: "",
    esperado: "nao_confirmada"
  }
];

let aprovados = 0;

for (const teste of testes) {
  const resultado = analisarGeografia(
    teste.localizacao
  );

  const passou = resultado.situacao === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.localizacao || "(vazia)",
    "| esperado:", teste.esperado,
    "| obtido:", resultado.situacao
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
