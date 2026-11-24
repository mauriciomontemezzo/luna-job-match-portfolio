import {
  adaptarPerfilCompetencias
} from "./adaptadorPerfilCompetencias";

const testes = [
  {
    nome: "Perfil valido",
    entrada: {
      competenciasDeclaradas: ["Python", "SQL"],
      competenciasAConfirmar: ["n8n"]
    },
    esperado: {
      competenciasDeclaradas: ["Python", "SQL"],
      competenciasAConfirmar: ["n8n"]
    }
  },
  {
    nome: "Listas ausentes",
    entrada: {},
    esperado: {
      competenciasDeclaradas: [],
      competenciasAConfirmar: []
    }
  },
  {
    nome: "Itens invalidos",
    entrada: {
      competenciasDeclaradas: ["Python", null, 123, ""],
      competenciasAConfirmar: [false, "SQL"]
    },
    esperado: {
      competenciasDeclaradas: ["Python"],
      competenciasAConfirmar: ["SQL"]
    }
  },
  {
    nome: "Duplicados e acentos",
    entrada: {
      competenciasDeclaradas: [
        "Automação", "automacao", " Python "
      ],
      competenciasAConfirmar: []
    },
    esperado: {
      competenciasDeclaradas: ["Automação", "Python"],
      competenciasAConfirmar: []
    }
  },
  {
    nome: "Entrada invalida",
    entrada: null,
    esperado: {
      competenciasDeclaradas: [],
      competenciasAConfirmar: []
    }
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const obtido = adaptarPerfilCompetencias(
    teste.entrada
  );

  const passou =
    JSON.stringify(obtido) ===
    JSON.stringify(teste.esperado);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO: ${aprovados}/${testes.length}`
);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
