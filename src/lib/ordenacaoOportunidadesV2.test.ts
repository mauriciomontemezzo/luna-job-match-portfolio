import { ordenarOportunidadesV2 } from "./ordenacaoOportunidadesV2";
import type { GrupoOportunidadeV2 } from "./ordenacaoOportunidadesV2";

type VagaTeste = {
  id: string;
  grupoOportunidade: GrupoOportunidadeV2;
};

const vagas: VagaTeste[] = [
  { id: "A", grupoOportunidade: "outras_oportunidades" },
  { id: "B", grupoOportunidade: "oportunidades_relacionadas" },
  { id: "C", grupoOportunidade: "correspondencia_identificada" },
  { id: "D", grupoOportunidade: "outras_oportunidades" },
  { id: "E", grupoOportunidade: "oportunidades_relacionadas" },
  { id: "F", grupoOportunidade: "correspondencia_identificada" }
];

let aprovados = 0;
let total = 0;

function verificar(nome: string, passou: boolean) {
  total++;
  console.log(passou ? "OK" : "FALHOU", "|", nome);
  if (passou) aprovados++;
}

const original = [...vagas];
const ordenadas = ordenarOportunidadesV2(vagas);

verificar(
  "Ordem correta dos grupos",
  ordenadas.map((v) => v.id).join(",") === "C,F,B,E,A,D"
);

verificar(
  "Preserva a quantidade de vagas",
  ordenadas.length === vagas.length
);

verificar(
  "Nao altera o array original",
  vagas.every((v, i) => v === original[i])
);

verificar(
  "Nao duplica nem elimina vagas",
  new Set(ordenadas.map((v) => v.id)).size === vagas.length
);

verificar(
  "Funciona com array vazio",
  ordenarOportunidadesV2([] as VagaTeste[]).length === 0
);

console.log(`RESULTADO: ${aprovados}/${total}`);

if (aprovados !== total) {
  process.exitCode = 1;
}
