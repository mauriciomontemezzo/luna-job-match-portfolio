import {
  calcularPrioridade,
  type EntradaPrioridade,
  type PrioridadeVaga
} from "./prioridadeVagas";

type Teste = {
  nome: string;
  entrada: EntradaPrioridade;
  esperado: PrioridadeVaga;
};

const base: EntradaPrioridade = {
  pontuacaoParcial: 90,
  pontuacaoMaximaAvaliada: 100,
  criteriosPendentes: [],
  alertaGeografico: false,
  incompatibilidadeSenioridade: false
};

const testes: Teste[] = [
  {
    nome: "Correspondencia alta",
    entrada: { ...base },
    esperado: "alta"
  },
  {
    nome: "Limite minimo de prioridade alta",
    entrada: { ...base, pontuacaoParcial: 80 },
    esperado: "alta"
  },
  {
    nome: "Correspondencia media",
    entrada: { ...base, pontuacaoParcial: 65 },
    esperado: "media"
  },
  {
    nome: "Correspondencia baixa",
    entrada: { ...base, pontuacaoParcial: 30 },
    esperado: "baixa"
  },
  {
    nome: "Alerta geografico",
    entrada: { ...base, alertaGeografico: true },
    esperado: "revisao_necessaria"
  },
  {
    nome: "Incompatibilidade de senioridade",
    entrada: {
      ...base,
      incompatibilidadeSenioridade: true
    },
    esperado: "revisao_necessaria"
  },
  {
    nome: "Criterios pendentes",
    entrada: {
      ...base,
      criteriosPendentes: ["Senioridade nao avaliada"]
    },
    esperado: "revisao_necessaria"
  },
  {
    nome: "Pontuacao invalida",
    entrada: {
      ...base,
      pontuacaoParcial: 110
    },
    esperado: "revisao_necessaria"
  },
  {
    nome: "Sem criterios avaliados",
    entrada: {
      ...base,
      pontuacaoParcial: 0,
      pontuacaoMaximaAvaliada: 0
    },
    esperado: "revisao_necessaria"
  }
];

let aprovados = 0;

for (const teste of testes) {
  const resultado = calcularPrioridade(teste.entrada);
  const passou = resultado.prioridade === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| esperado:", teste.esperado,
    "| obtido:", resultado.prioridade
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
