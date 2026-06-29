/**
 * lib/lineMessages.ts
 * LINE送信メッセージのテンプレート集
 * Flex Message を使ってリッチな見た目を実現
 */

import type {
  LineMessage,
  LineTextMessage,
  LineFlexMessage,
  NotifyResultPayload,
} from "@/types/line";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://career-lp-ps5y.vercel.app";
}

// ===== 友だち追加時のウェルカムメッセージ =====
export function buildWelcomeMessages(displayName: string): LineMessage[] {
  const text: LineTextMessage = {
    type: "text",
    text: `${displayName}さん、はじめまして！🎉\nキャリアUPサポートのLINE公式アカウントへようこそ。\n\n転職に関するご相談は、いつでもこちらにメッセージをお送りください。担当コンサルタントが丁寧にサポートします。`,
  };

  const flex: LineFlexMessage = {
    type: "flex",
    altText: "キャリアUPサポートへようこそ",
    contents: {
      type: "bubble",
      styles: {
        header: { backgroundColor: "#2563EB" },
        footer: { backgroundColor: "#F8FAFC" },
      },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "まずは転職タイプ診断！",
            color: "#FFFFFF",
            weight: "bold",
            size: "lg",
          },
          {
            type: "text",
            text: "10問・約2分で完了",
            color: "#BFDBFE",
            size: "sm",
            margin: "xs",
          },
        ],
        padding: "lg",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "診断でわかること",
            weight: "bold",
            size: "md",
            color: "#1E293B",
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              makeCheckItem("あなたの転職タイプ（4種類）"),
              makeCheckItem("想定年収アップ幅"),
              makeCheckItem("おすすめ職種"),
              makeCheckItem("具体的な転職アドバイス"),
            ],
            margin: "md",
            spacing: "sm",
          },
        ],
        padding: "lg",
        spacing: "md",
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: "無料で診断スタート →",
              uri: `${getBaseUrl()}/diagnosis`,
            },
            style: "primary",
            color: "#2563EB",
            height: "md",
          },
          {
            type: "button",
            action: {
              type: "uri",
              label: "無料相談を予約する",
              uri: "https://timerex.net/s/dajietianbian357_782c/1c65b0da",
            },
            style: "secondary",
            height: "md",
            margin: "sm",
          },
        ],
        padding: "lg",
        spacing: "sm",
      },
    },
  };

  return [text, flex];
}

// ===== 診断完了通知メッセージ =====
export function buildDiagnosisResultMessages(
  payload: NotifyResultPayload
): LineMessage[] {
  const { userName, typeName, incomeUpRange, successRate, recommendedJobs, bookingUrl } =
    payload;

  const jobList = recommendedJobs.slice(0, 3).join("・");

  const flex: LineFlexMessage = {
    type: "flex",
    altText: `${userName}さんの診断結果が出ました！`,
    contents: {
      type: "bubble",
      styles: {
        header: { backgroundColor: "#1E3A8A" },
        footer: { backgroundColor: "#F0FDF4" },
      },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "🎉 診断結果",
            color: "#93C5FD",
            size: "sm",
            weight: "bold",
          },
          {
            type: "text",
            text: `${userName}さんのタイプは…`,
            color: "#FFFFFF",
            size: "md",
            margin: "xs",
          },
          {
            type: "text",
            text: typeName,
            color: "#FDE047",
            size: "xl",
            weight: "bold",
            wrap: true,
            margin: "sm",
          },
        ],
        padding: "xl",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              makeMetricBox("想定年収UP", incomeUpRange, "#22C55E"),
              makeMetricBox("成功可能性", `${successRate}%`, "#2563EB"),
            ],
            spacing: "md",
          },
          { type: "separator", margin: "lg", color: "#E2E8F0" },
          {
            type: "text",
            text: "おすすめ職種",
            weight: "bold",
            size: "sm",
            color: "#475569",
            margin: "lg",
          },
          {
            type: "text",
            text: jobList,
            size: "md",
            weight: "bold",
            color: "#1E3A8A",
            wrap: true,
            margin: "xs",
          },
        ],
        padding: "xl",
        spacing: "sm",
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "詳細は無料相談でご説明します",
            size: "xs",
            color: "#64748B",
            align: "center",
          },
          {
            type: "button",
            action: {
              type: "uri",
              label: "無料相談を予約する →",
              uri: bookingUrl,
            },
            style: "primary",
            color: "#22C55E",
            height: "md",
            margin: "sm",
          },
          {
            type: "button",
            action: {
              type: "uri",
              label: "診断結果の詳細を見る",
              uri: `${getBaseUrl()}/result`,
            },
            style: "secondary",
            height: "md",
            margin: "xs",
          },
        ],
        padding: "xl",
        spacing: "xs",
      },
    },
  };

  return [flex];
}

// ===== フォローアップメッセージ（3日後・未予約者向け） =====
export function buildFollowUpMessages(userName: string): LineMessage[] {
  return [
    {
      type: "text",
      text: `${userName}さん、こんにちは！\n\n先日の診断、ご確認いただけましたか？✨\n\n転職活動は「情報収集」が成功の鍵です。まずは無料相談で、今の求人状況や年収相場をお伝えできます。\n\n気軽に話すだけでもOKです👇`,
    } as LineTextMessage,
    {
      type: "flex",
      altText: "無料相談のご案内",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "📅 無料相談の詳細",
              weight: "bold",
              size: "md",
              color: "#1E293B",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                makeCheckItem("完全無料・登録不要"),
                makeCheckItem("オンライン（Zoom）で実施"),
                makeCheckItem("所要60分程度"),
                makeCheckItem("内定まで一貫サポート"),
              ],
              margin: "md",
              spacing: "sm",
            },
          ],
          padding: "xl",
          spacing: "md",
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              action: {
                type: "uri",
                label: "今すぐ予約する（無料）",
                uri: "https://timerex.net/s/dajietianbian357_782c/1c65b0da",
              },
              style: "primary",
              color: "#2563EB",
              height: "md",
            },
          ],
          padding: "lg",
        },
      },
    } as LineFlexMessage,
  ];
}

// ===== キーワード自動返信メッセージ =====
export function buildKeywordReplyMessages(keyword: string): LineMessage[] | null {
  const kw = keyword.trim();

  if (/^(診断|しんだん|相談|予約|よやく)/.test(kw)) {
    return [
      {
        type: "text",
        text: "ご連絡ありがとうございます！\n\n下のボタンから無料診断・無料相談をご利用いただけます。",
      } as LineTextMessage,
      {
        type: "template",
        altText: "メニュー",
        template: {
          type: "buttons",
          text: "ご用件をお選びください",
          actions: [
            { type: "uri", label: "転職タイプ診断（無料）", uri: `${getBaseUrl()}/diagnosis` },
            { type: "uri", label: "無料相談を予約",         uri: "https://timerex.net/s/dajietianbian357_782c/1c65b0da"   },
            { type: "uri", label: "LINE登録特典を確認",     uri: "https://lin.ee/vgqwKg7"      },
          ],
        },
      },
    ];
  }

  if (/^(年収|ねんしゅう|給料)/.test(kw)) {
    return [
      {
        type: "text",
        text: "年収についてのご質問ですね！💰\n\n現在の職種や経験によって転職後の年収は大きく変わります。\n\n無料相談では、あなたの状況に合わせた具体的な年収レンジをお伝えします。まずはお気軽にどうぞ！",
      } as LineTextMessage,
    ];
  }

  if (/^(求人|きゅうじん|仕事|しごと)/.test(kw)) {
    return [
      {
        type: "text",
        text: "求人についてのお問い合わせですね！\n\n非公開求人を含む多数の求人をご紹介できます。まずは診断で、あなたに合った職種を確認してみましょう👇",
      } as LineTextMessage,
    ];
  }

  // マッチなし → null（デフォルト返信なし）
  return null;
}

// ===== ユーティリティ =====
function makeCheckItem(text: string) {
  return {
    type: "box" as const,
    layout: "horizontal" as const,
    contents: [
      { type: "text" as const, text: "✓", color: "#22C55E", size: "sm" as const, flex: 0 },
      { type: "text" as const, text, size: "sm" as const, color: "#334155", wrap: true, margin: "sm" },
    ],
  };
}

function makeMetricBox(label: string, value: string, color: string) {
  return {
    type: "box" as const,
    layout: "vertical" as const,
    contents: [
      { type: "text" as const, text: label, size: "xxs" as const, color: "#64748B", align: "center" as const },
      { type: "text" as const, text: value, size: "lg" as const, weight: "bold" as const, color, align: "center" as const, margin: "xs" },
    ],
    flex: 1,
    backgroundColor: "#F8FAFC",
    cornerRadius: "8px",
    padding: "md",
  };
}
