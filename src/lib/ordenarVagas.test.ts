import { ordenarVagas } from "./ordenarVagas";
import type { VagaOrdenavel } from "./ordenarVagas";

type VagaTeste = VagaOrdenavel & {
  id: string;
};

const vagas: VagaTeste[] = [
  {
    id: "sem-correspondencia",
    analise: { relevancia: "nao_identificada" },
    tecnologias: { totalEncontradas: 3 }
  },
  {
    id: "parcial-uma-tecnologia",
    analise: { relevancia: "parcial" },
    tecnologias: { totalEncontradas: 1 }
  },
  {
    id: "direta-uma-tecnologia",
    analise: { relevancia: "direta" },
    tecnologias: { totalEncontradas: 1 }
  },
  {
    id: "parcial-tres-tecnologias",
    analise: { relevancia: "parcial" },
    tecnologias: { totalEncontradas: 3 }
  },
  {
    id: "direta-duas-tecnologias",
    analise: { relevancia: "direta" },
    tecnologias: { totalEncontradas: 2 }
  }
];

const original = vagas.map(vaga => vaga.id);

const resultado = ordenarVagas(vagas);

const esperado = [
  "direta-duas-tecnologias",
  "direta-uma-tecnologia",
  "parcial-tres-tecnologias",
  "parcial-uma-tecnologia",
  "sem-correspondencia"
];

const ordemCorreta =
  JSON.stringify(resultado.map(vaga => vaga.id)) ===
  JSON.stringify(esperado);

const originalPreservado =
  JSON.stringify(vagas.map(vaga => vaga.id)) ===
  JSON.stringify(original);

console.log(
  ordemCorreta ? "OK" : "FALHOU",
  "| Ordenacao por relevancia e tecnologias"
);

console.log(
  originalPreservado ? "OK" : "FALHOU",
  "| Lista original preservada"
);

console.log(
  "ORDEM:",
  resultado.map(vaga => vaga.id).join(" -> ")
);

console.log(
  `RESULTADO: ${
    Number(ordemCorreta) + Number(originalPreservado)
  }/2`
);

if (!ordemCorreta || !originalPreservado) {
  process.exitCode = 1;
}
