import { compararSenioridade } from "./compararSenioridade";
import type { NivelSenioridade } from "./analiseSenioridade";
import type { SituacaoSenioridade } from "./compararSenioridade";

type Teste = {
  nome: string;
  nivelVaga: NivelSenioridade;
  preferencia: string;
  esperado: SituacaoSenioridade;
};

const testes: Teste[] = [
  {
    nome: "Junior com Junior",
    nivelVaga: "junior",
    preferencia: "junior",
    esperado: "correspondente"
  },
  {
    nome: "Pleno com Pleno",
    nivelVaga: "pleno",
    preferencia: "pleno",
    esperado: "correspondente"
  },
  {
    nome: "Senior com Senior",
    nivelVaga: "senior",
    preferencia: "senior",
    esperado: "correspondente"
  },
  {
    nome: "Junior procurando vaga Senior",
    nivelVaga: "senior",
    preferencia: "junior",
    esperado: "possivel_incompatibilidade"
  },
  {
    nome: "Pleno procurando Lideranca",
    nivelVaga: "lideranca",
    preferencia: "pleno",
    esperado: "possivel_incompatibilidade"
  },
  {
    nome: "Senior procurando vaga Junior",
    nivelVaga: "junior",
    preferencia: "senior",
    esperado: "nao_confirmada"
  },
  {
    nome: "Vaga sem senioridade identificada",
    nivelVaga: "nao_identificada",
    preferencia: "pleno",
    esperado: "nao_confirmada"
  },
  {
    nome: "Preferencia indiferente",
    nivelVaga: "senior",
    preferencia: "indiferente",
    esperado: "sem_restricao"
  },
  {
    nome: "Preferencia desconhecida",
    nivelVaga: "junior",
    preferencia: "desconhecida",
    esperado: "nao_confirmada"
  }
];

let aprovados = 0;

for (const teste of testes) {
  const resultado = compararSenioridade(
    teste.nivelVaga,
    teste.preferencia
  );

  const passou = resultado.situacao === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| esperado:", teste.esperado,
    "| obtido:", resultado.situacao
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
