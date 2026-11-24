import { analisarCargo } from "./compatibilidadeVagas";
import {
  analisarEstruturaProfissional
} from "./estruturaProfissional";

export function compararAnalisesProfissionais(
  cargoVaga: string,
  cargoDesejado: string
) {
  const analiseAtual = analisarCargo(
    cargoVaga,
    cargoDesejado
  );

  const estruturaVaga =
    analisarEstruturaProfissional(cargoVaga);

  const estruturaDesejada =
    analisarEstruturaProfissional(cargoDesejado);

  const funcoesEmComum =
    estruturaVaga.funcoes.filter((funcao) =>
      estruturaDesejada.funcoes.includes(funcao)
    );

  const especialidadesEmComum =
    estruturaVaga.especialidades.filter(
      (especialidade) =>
        estruturaDesejada.especialidades.includes(
          especialidade
        )
    );

  const tecnologiasEmComum =
    estruturaVaga.tecnologias.filter(
      (tecnologia) =>
        estruturaDesejada.tecnologias.includes(
          tecnologia
        )
    );

  return {
    analiseAtual,
    estruturaVaga,
    estruturaDesejada,
    comparacao: {
      funcoesEmComum,
      especialidadesEmComum,
      tecnologiasEmComum
    }
  };
}
