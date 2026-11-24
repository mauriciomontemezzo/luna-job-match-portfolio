import {
  catalogoExpansaoMulticarreirasV3
} from "./catalogoExpansaoMulticarreirasV3";

const areasEsperadas = [
  "educacao",
  "administracao",
  "atendimento",
  "financas"
];

let aprovados = 0;
let total = 0;

function verificar(
  nome: string,
  condicao: boolean
) {
  total++;

  console.log(
    condicao ? "OK" : "FALHOU",
    "|",
    nome
  );

  if (condicao) aprovados++;
}

const areas = catalogoExpansaoMulticarreirasV3.map(
  (familia) => familia.area
);

verificar(
  "Quatro familias cadastradas",
  catalogoExpansaoMulticarreirasV3.length === 4
);

verificar(
  "Todas as areas esperadas",
  areasEsperadas.every((area) => areas.includes(area))
);

verificar(
  "Areas sem duplicacao",
  new Set(areas).size === areas.length
);

verificar(
  "Familias com cargos",
  catalogoExpansaoMulticarreirasV3.every(
    (familia) => familia.cargos.length >= 2
  )
);

verificar(
  "Tipos validos",
  catalogoExpansaoMulticarreirasV3.every(
    (familia) =>
      familia.tipo === "direta" ||
      familia.tipo === "parcial"
  )
);

const cargos = catalogoExpansaoMulticarreirasV3.flatMap(
  (familia) =>
    familia.cargos.map(
      (cargo) => cargo.trim().toLowerCase()
    )
);

verificar(
  "Cargos sem duplicacao",
  new Set(cargos).size === cargos.length
);

verificar(
  "Cargos sem valores vazios",
  cargos.every((cargo) => cargo.length > 0)
);

verificar(
  "Cargos normalizados",
  cargos.every(
    (cargo) => cargo === cargo.trim().toLowerCase()
  )
);

console.log(
  `RESULTADO_CATALOGO: ${aprovados}/${total}`
);

if (aprovados !== total) {
  process.exitCode = 1;
}
