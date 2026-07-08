const TG_API = "https://api.telegram.org";

export function tgUrl(botToken: string, method: string) {
  return `${TG_API}/bot${botToken}/${method}`;
}

export async function sendMessage(
  botToken: string,
  chatId: number | string,
  text: string,
  extra: Record<string, any> = {}
) {
  return fetch(tgUrl(botToken, "sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", ...extra }),
  });
}

export async function answerCallbackQuery(botToken: string, callbackQueryId: string, text?: string) {
  return fetch(tgUrl(botToken, "answerCallbackQuery"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}

export async function getFileDownloadUrl(botToken: string, fileId: string): Promise<string> {
  const res = await fetch(tgUrl(botToken, "getFile") + `?file_id=${fileId}`);
  const data = await res.json();
  const filePath = data.result.file_path;
  return `${TG_API}/file/bot${botToken}/${filePath}`;
}

export async function downloadFileAsBase64(botToken: string, fileId: string): Promise<string> {
  const fileUrl = await getFileDownloadUrl(botToken, fileId);
  const res = await fetch(fileUrl);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf).toString("base64");
}

export function mainMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "🪙 Crypto", callback_data: "menu_crypto" }],
      [{ text: "🥇 XAUUSD (Gold)", callback_data: "menu_gold" }],
      [{ text: "💱 Forex", callback_data: "menu_forex" }],
      [{ text: "📈 Saham IDX & US", callback_data: "menu_stock" }],
      [{ text: "📘 Panduan", callback_data: "menu_guide" }],
    ],
  };
}

export function startKeyboard() {
  return {
    inline_keyboard: [[{ text: "🚀 Mulai Bot", callback_data: "start_bot" }]],
  };
}

export function backToMenuKeyboard() {
  return {
    inline_keyboard: [[{ text: "⬅️ Kembali ke Menu", callback_data: "back_menu" }]],
  };
}

export const MENU_LABELS: Record<string, string> = {
  menu_crypto: "Crypto",
  menu_gold: "XAUUSD (Gold)",
  menu_forex: "Forex",
  menu_stock: "Saham IDX & US",
};

export const GUIDE_TEXT = `📘 <b>Panduan Penggunaan Bot</b>

💡 <b>Tips agar hasil maksimal:</b>
• Screenshot HD — nama aset, harga, dan skala harus terlihat jelas
• Tampilkan volume + EMA20/50/200 + RSI di chart
• Idealnya kirim 3 timeframe sekaligus, tapi bisa mengirim 1-3 screenshot saja

⚠️ Jika screenshot/foto kurang jelas, bot akan meminta kamu mengirim ulang yang lebih jelas.

Setelah kamu selesai kirim screenshot, ketik <b>analisa</b> untuk memulai proses analisis.`;
