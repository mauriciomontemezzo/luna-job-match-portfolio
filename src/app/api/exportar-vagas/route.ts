import ExcelJS from "exceljs";



type Registro = Record<string, unknown>;

function objeto(v: unknown): v is Registro {
  return v !== null &&
    typeof v === "object" &&
    !Array.isArray(v);
}

function texto(v: unknown, limite = 3000): string {
  const valor = String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .slice(0, limite);

  // Evita que textos externos sejam interpretados
  // como formulas em outros formatos de planilha.
  return /^[=+\-@\t\r\n]/.test(valor)
    ? "'" + valor
    : valor;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(
      { ok: false, mensagem: "Rota indisponivel." },
      { status: 404 }
    );
  }

  try {
    if (
      !request.headers.get("content-type")
        ?.startsWith("application/json")
    ) {
      return Response.json(
        { ok: false, mensagem: "Envie JSON." },
        { status: 415 }
      );
    }

    const corpo = await request.text();

    if (new TextEncoder().encode(corpo).length > 65536) {
      return Response.json(
        { ok: false, mensagem: "Dados muito grandes." },
        { status: 413 }
      );
    }

    const dados: unknown = JSON.parse(corpo);

    if (!objeto(dados) || !Array.isArray(dados.vagas)) {
      throw new Error("Lista invalida.");
    }

    const vagas: unknown[] = dados.vagas;

    if (vagas.length < 1 || vagas.length > 50) {
      throw new Error("Quantidade invalida.");
    }

    const tipoExportacao =
      dados.tipo === undefined ? "simulacao" : dados.tipo;

    if (
      tipoExportacao !== "simulacao" &&
      tipoExportacao !== "real"
    ) {
      throw new Error("Tipo de exportacao invalido.");
    }

    const reais = tipoExportacao === "real";

    if (!vagas.every((v) => {
      if (
        !objeto(v) ||
        typeof v.cargo !== "string" ||
        typeof v.empresa !== "string" ||
        typeof v.localizacao !== "string" ||
        !Array.isArray(v.motivos) ||
        !v.motivos.every(
          (m: unknown) => typeof m === "string"
        )
      ) {
        return false;
      }

      if (reais) {
        if (
          typeof v.pontuacao !== "number" ||
          !Number.isFinite(v.pontuacao) ||
          v.pontuacao < 0 ||
          v.pontuacao > 100 ||
          typeof v.pontuacaoMaximaAvaliada !== "number" ||
          !Number.isFinite(v.pontuacaoMaximaAvaliada) ||
          v.pontuacaoMaximaAvaliada < 0 ||
          v.pontuacaoMaximaAvaliada > 100 ||
          v.pontuacao > v.pontuacaoMaximaAvaliada
        ) {
          return false;
        }

        if (
          typeof v.prioridade !== "string" ||
          ![
            "alta",
            "media",
            "baixa",
            "revisao_necessaria"
          ].includes(v.prioridade)
        ) {
          return false;
        }

        if (typeof v.linkCandidatura !== "string") {
          return false;
        }

        try {
          const url = new URL(v.linkCandidatura);
          return (
            url.protocol === "https:" &&
            Boolean(url.hostname) &&
            !url.username &&
            !url.password &&
            v.linkCandidatura.length <= 2048
          );
        } catch {
          return false;
        }
      }

      return (
        typeof v.pontuacao === "number" &&
        Number.isFinite(v.pontuacao) &&
        v.pontuacao >= 0 &&
        v.pontuacao <= 100 &&
        ["alta", "media", "baixa"].includes(
          String(v.prioridade)
        )
      );
    })) {
      throw new Error("Dados de vagas invalidos.");
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "LUNA Job Match";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(
      "Vagas selecionadas"
    );

    sheet.columns = [
      { key: "cargo", width: 38 },
      { key: "empresa", width: 32 },
      { key: "pontuacao", width: 16 },
      { key: "prioridade", width: 18 },
      { key: "localizacao", width: 28 },
      { key: "motivos", width: 65 },
      { key: "link", width: 42 }
    ];

    sheet.mergeCells("A1:G1");
    const titulo = sheet.getCell("A1");
    titulo.value = "LUNA JOB MATCH | VAGAS SELECIONADAS";
    titulo.font = {
      bold: true,
      size: 17,
      color: { argb: "FFFFFFFF" }
    };
    titulo.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF252B58" }
    };
    titulo.alignment = {
      vertical: "middle"
    };
    sheet.getRow(1).height = 38;

    sheet.mergeCells("A2:G2");
    const aviso = sheet.getCell("A2");
    aviso.value = reais
      ? "VAGAS REAIS — pontuacao experimental; nao representa chance de contratacao."
      : "SIMULACAO — vagas ficticias, sem links de candidatura.";
    aviso.font = {
      italic: true,
      color: { argb: "FF64748B" }
    };
    sheet.getRow(2).height = 25;

    sheet.getRow(4).values = [
      "Cargo",
      "Empresa",
      "Pontuação",
      "Prioridade",
      "Localização",
      "Motivos",
      "LinkCandidatura"
    ];

    const cabecalho = sheet.getRow(4);
    cabecalho.height = 28;

    cabecalho.eachCell(
      { includeEmpty: true },
      (celula) => {
        celula.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4F46E5" }
        };
        celula.font = {
          bold: true,
          color: { argb: "FFFFFFFF" }
        };
        celula.alignment = {
          vertical: "middle"
        };
      }
    );

    for (const item of vagas) {
      const vaga = item as Registro;

      const linha = sheet.addRow([
        texto(vaga.cargo, 200),
        texto(vaga.empresa, 200),
        reais
          ? `${vaga.pontuacao}/${vaga.pontuacaoMaximaAvaliada}`
          : vaga.pontuacao,
        reais
          ? ({
              alta: "ALTA",
              media: "MEDIA",
              baixa: "BAIXA",
              revisao_necessaria: "REVISAO NECESSARIA"
            }[String(vaga.prioridade)] ?? "REVISAO NECESSARIA")
          : texto(vaga.prioridade, 20).toUpperCase(),
        texto(vaga.localizacao, 200),
        texto(
          (vaga.motivos as string[]).join(" | ")
        ),
        reais ? texto(vaga.linkCandidatura, 2048) : ""
      ]);

      const motivosTexto = (vaga.motivos as string[]).join(" | ");

      const linhasEstimadas = Math.max(
        1,
        Math.ceil(motivosTexto.length / 65)
      );

      linha.height = Math.min(
        300,
        Math.max(46, linhasEstimadas * 16 + 16)
      );

      linha.eachCell(
        { includeEmpty: true },
        (celula) => {
          celula.alignment = {
            vertical: "middle",
            wrapText: true
          };
          celula.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: linha.number % 2 === 0
                ? "FFF1F5F9"
                : "FFFFFFFF"
            }
          };
        }
      );

      linha.getCell(3).numFmt = "0";
      linha.getCell(3).font = {
        bold: true,
        color: { argb: "FF3730A3" }
      };
    }

    sheet.views = [
      { state: "frozen", ySplit: 4 }
    ];

    sheet.autoFilter = {
      from: "A4",
      to: `G${4 + vagas.length}`
    };

    const buffer = await workbook.xlsx.writeBuffer();

    const arquivo = new ArrayBuffer(buffer.byteLength);
    new Uint8Array(arquivo).set(buffer as unknown as number[]);

    return new Response(arquivo, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="luna-vagas-selecionadas.xlsx"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });

  } catch {
    return Response.json(
      {
        ok: false,
        mensagem: "Nao foi possivel gerar o Excel."
      },
      { status: 400 }
    );
  }
}
