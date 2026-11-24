import { calcularPontuacao } from "./pontuacaoVagas";
import type { EntradaPontuacao } from "./pontuacaoVagas";

type Teste = {
  nome: string;
  entrada: EntradaPontuacao;
  pontos: number;
  maximo: number;
};

const testes: Teste[] = [
  {
    nome: "Cargo direto, tecnologias e Brasil",
    entrada: {
      relevanciaCargo: "direta",
      tecnologiasEncontradas: 3,
      tecnologiasDesejadas: 3,
      situacaoGeografica: "brasil_mencionado"
    },
    pontos: 90,
    maximo: 90
  },
  {
    nome: "Cargo parcial e LATAM",
    entrada: {
      relevanciaCargo: "parcial",
      tecnologiasEncontradas: 1,
      tecnologiasDesejadas: 2,
      situacaoGeografica: "regiao_compativel"
    },
    pontos: 50,
    maximo: 90
  },
  {
    nome: "Cargo nao identificado, anuncio global",
    entrada: {
      relevanciaCargo: "nao_identificada",
      tecnologiasEncontradas: 0,
      tecnologiasDesejadas: 2,
      situacaoGeografica: "global"
    },
    pontos: 10,
    maximo: 90
  },
  {
    nome: "Restricao geografica explicita",
    entrada: {
      relevanciaCargo: "direta",
      tecnologiasEncontradas: 2,
      tecnologiasDesejadas: 2,
      situacaoGeografica: "restricao_identificada"
    },
    pontos: 70,
    maximo: 90
  },
  {
    nome: "Informacoes desconhecidas",
    entrada: {
      relevanciaCargo: "parcial",
      tecnologiasEncontradas: 0,
      tecnologiasDesejadas: 0,
      situacaoGeografica: "nao_confirmada"
    },
    pontos: 20,
    maximo: 40
  }
];


const testesSenioridade = [
  {
    nome: "Senioridade correspondente",
    situacao: "correspondente",
    pontos: 100,
    maximo: 100,
    detalhe: 10
  },
  {
    nome: "Possivel incompatibilidade",
    situacao: "possivel_incompatibilidade",
    pontos: 90,
    maximo: 100,
    detalhe: 0
  },
  {
    nome: "Senioridade nao confirmada",
    situacao: "nao_confirmada",
    pontos: 90,
    maximo: 90,
    detalhe: null
  },
  {
    nome: "Preferencia indiferente",
    situacao: "sem_restricao",
    pontos: 90,
    maximo: 90,
    detalhe: null
  }
] as const;

let aprovadosSenioridade = 0;

for (const teste of testesSenioridade) {
  const resultado = calcularPontuacao({
    relevanciaCargo: "direta",
    tecnologiasEncontradas: 2,
    tecnologiasDesejadas: 2,
    situacaoGeografica: "brasil_mencionado",
    situacaoSenioridade: teste.situacao
  });

  const passou =
    resultado.pontuacaoParcial === teste.pontos &&
    resultado.pontuacaoMaximaAvaliada === teste.maximo &&
    resultado.detalhes.senioridade === teste.detalhe;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| pontos:", resultado.pontuacaoParcial,
    "| maximo:", resultado.pontuacaoMaximaAvaliada
  );

  if (passou) aprovadosSenioridade++;
}

console.log(
  `RESULTADO_SENIORIDADE: ${aprovadosSenioridade}/${testesSenioridade.length}`
);

if (aprovadosSenioridade !== testesSenioridade.length) {
  process.exitCode = 1;
}

let aprovados = 0;

for (const teste of testes) {
  const resultado = calcularPontuacao(teste.entrada);

  const passou =
    resultado.pontuacaoParcial === teste.pontos &&
    resultado.pontuacaoMaximaAvaliada === teste.maximo &&
    resultado.detalhes.senioridade === null &&
    resultado.alertaGeografico ===
      (teste.entrada.situacaoGeografica ===
        "restricao_identificada") &&
    resultado.criteriosPendentes.includes(
      "Senioridade nao avaliada"
    );

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| pontos:", resultado.pontuacaoParcial,
    "| maximo:", resultado.pontuacaoMaximaAvaliada
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
