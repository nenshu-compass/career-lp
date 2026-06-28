# LINE Messaging API 連携ガイド

このドキュメントでは、career-lp に LINE Messaging API を接続する手順を説明します。

---

## 📁 追加ファイル一覧

```
types/line.ts                        # LINE API の型定義
lib/line.ts                          # LINE API クライアント（push/reply/multicast）
lib/lineMessages.ts                  # Flex Message テンプレート集
hooks/useLineNotify.ts               # 診断完了時の通知フック
app/api/line/
  webhook/route.ts                   # Webhook受信（友だち追加・メッセージ）
  notify-result/route.ts             # 診断結果通知API
  send/route.ts                      # 汎用メッセージ送信API
  followup/route.ts                  # フォローアップ一括送信（Cron用）
vercel.json                          # Vercel Cron 設定（毎朝10時に実行）
.env.local.example                   # 環境変数サンプル
```

---

## 🚀 セットアップ手順

### 1. LINE Developers でチャネルを作成

1. [LINE Developers Console](https://developers.line.biz/) にログイン
2. 「新規プロバイダー作成」→「Messaging APIチャネル作成」
3. チャネル名: `キャリアUPサポート`（任意）
4. **チャネルシークレット**をコピー（後で使用）

### 2. チャネルアクセストークンを発行

1. チャネル → Messaging API タブ
2. 「チャネルアクセストークン（長期）」→「発行」
3. 発行されたトークンをコピー

### 3. 環境変数を設定

```bash
# .env.local を作成
cp .env.local.example .env.local
```

`.env.local` を編集:

```env
LINE_CHANNEL_ACCESS_TOKEN=発行したアクセストークン
LINE_CHANNEL_SECRET=チャネルシークレット
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
INTERNAL_API_KEY=openssl rand -hex 32 で生成した文字列
CRON_SECRET=openssl rand -hex 32 で生成した文字列
```

### 4. Vercel にデプロイして Webhook URL を設定

```bash
npx vercel --prod
```

デプロイ後、Vercel の環境変数にも同じ値を設定してください。

LINE Developers Console → Messaging API → Webhook設定:

```
Webhook URL: https://your-domain.vercel.app/api/line/webhook
Webhookの利用: ON
```

「検証」ボタンで `200 OK` が返れば成功です。

### 5. 応答メッセージをOFFにする

LINE Developers → Messaging API → 応答設定:
- 「応答メッセージ」→ **オフ**（Webhookで制御するため）
- 「あいさつメッセージ」→ **オフ**（コードで送信するため）

---

## 📡 APIエンドポイント

### `POST /api/line/webhook`
LINE プラットフォームからの Webhook を受信します。

**対応イベント:**
| イベント | 処理 |
|---------|------|
| `follow` | ウェルカム Flex Message を返信 |
| `unfollow` | ログのみ（将来: DB更新） |
| `message` (text) | キーワード自動返信 |

---

### `POST /api/line/notify-result`
診断完了時に結果 Flex Message を Push 送信します。

**リクエスト:**
```json
{
  "userId": "Uxxxxxxxxxx",
  "recordId": "診断レコードID",
  "userName": "田中太郎",
  "typeName": "営業職で年収アップタイプ",
  "incomeUpRange": "+80〜200万円",
  "successRate": 87,
  "recommendedJobs": ["法人営業", "不動産営業", "IT営業"],
  "bookingUrl": "https://your-domain.com/booking"
}
```

**ヘッダー:**
```
x-internal-api-key: your_INTERNAL_API_KEY
```

---

### `POST /api/line/send`
任意のメッセージを Push 送信します（管理画面からの手動送信など）。

**リクエスト:**
```json
{
  "to": "Uxxxxxxxxxx",
  "messages": [{ "type": "text", "text": "こんにちは！" }]
}
```

---

### `GET /api/line/followup`
フォローアップメッセージを一括送信します（Vercel Cron から毎朝10時に実行）。

**ヘッダー:**
```
Authorization: Bearer your_CRON_SECRET
```

---

## 🔄 LINE userId を診断フォームと紐付ける方法

### 方法A: URLパラメータ経由（シンプル）

LINE公式アカウントのリッチメニューから診断ページに誘導する際に、
`lineUserId` をURLパラメータとして付与します。

```
https://your-domain.com/diagnosis?lineUserId=Uxxxxxxxxxx
```

LINEの LIFF (LINE Front-end Framework) を使えば自動取得できます。

### 方法B: LIFF で自動取得（推奨）

1. LINE Developers → LIFF タブ → LIFF アプリ追加
2. エンドポイントURL: `https://your-domain.com/diagnosis`
3. フロントエンドで LIFF SDK を使って userId を取得:

```typescript
// app/diagnosis/page.tsx に追加
import liff from "@line/liff";

useEffect(() => {
  liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
    .then(() => {
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        // URLに lineUserId を追加してフォームに渡す
      }
    });
}, []);
```

---

## 💬 自動返信キーワード一覧

| キーワード | 返信内容 |
|-----------|---------|
| 「診断」「相談」「予約」 | メニューボタン付きメッセージ |
| 「年収」「給料」 | 年収相談の案内 |
| 「求人」「仕事」 | 求人紹介の案内 |
| その他 | デフォルト返信（担当者対応） |

---

## 🔮 将来の拡張予定

- **Supabase連携**: `line_user_id` カラムを `user_records` に追加し、Webhook で自動更新
- **OpenAI連携**: 診断コメントをGPTで個別生成し LINE で送信
- **リッチメニュー**: 診断・相談・実績紹介のメニューボタンを設置
- **LIFF対応**: ログイン済みユーザーの userId を自動取得して診断と紐付け
