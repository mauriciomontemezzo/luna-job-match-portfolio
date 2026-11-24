import { connection } from "next/server";
import { NextResponse } from "next/server";

export async function GET() {
  await connection();
  const url = process.env.LUNA_N8N_HEALTH_URL;

  if (!url) {
    return NextResponse.json(
      {
        ok: false,
        mensagem: "API da LUNA não configurada.",
      },
      { status: 503 }
    );
  }

  try {
    const resposta = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!resposta.ok) {
      throw new Error(`n8n HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();

    if (dados?.ok !== true) {
      throw new Error("Resposta inesperada do n8n");
    }

    return NextResponse.json({
      ok: true,
      servico: "LUNA Job Match",
      conexao: "Next.js + n8n",
      mensagem: "Integração funcionando!",
    });
  } catch (erro) {
    console.error("Erro na conexão LUNA:", erro);

    return NextResponse.json(
      {
        ok: false,
        mensagem: "Motor da LUNA indisponível.",
      },
      { status: 502 }
    );
  }
}
