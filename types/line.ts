// ===== LINE Messaging API 型定義 =====

// --- Webhookイベント共通 ---
export interface LineWebhookBody {
  destination: string;
  events: LineEvent[];
}

export type LineEvent =
  | LineFollowEvent
  | LineUnfollowEvent
  | LineMessageEvent
  | LinePostbackEvent;

interface LineEventBase {
  type: string;
  webhookEventId: string;
  deliveryContext: { isRedelivery: boolean };
  timestamp: number;
  source: LineEventSource;
  replyToken?: string;
  mode: "active" | "standby";
}

export interface LineEventSource {
  type: "user" | "group" | "room";
  userId: string;
  groupId?: string;
  roomId?: string;
}

// 友だち追加
export interface LineFollowEvent extends LineEventBase {
  type: "follow";
  replyToken: string;
}

// ブロック
export interface LineUnfollowEvent extends LineEventBase {
  type: "unfollow";
}

// テキストメッセージ
export interface LineMessageEvent extends LineEventBase {
  type: "message";
  replyToken: string;
  message: {
    type: "text";
    id: string;
    text: string;
  };
}

// ポストバック（ボタン押下など）
export interface LinePostbackEvent extends LineEventBase {
  type: "postback";
  replyToken: string;
  postback: {
    data: string;
    params?: Record<string, string>;
  };
}

// --- 送信メッセージ型 ---
export type LineMessage =
  | LineTextMessage
  | LineFlexMessage
  | LineTemplateMessage;

export interface LineTextMessage {
  type: "text";
  text: string;
}

export interface LineFlexMessage {
  type: "flex";
  altText: string;
  contents: FlexContainer;
}

export interface LineTemplateMessage {
  type: "template";
  altText: string;
  template: {
    type: "buttons" | "confirm" | "carousel";
    [key: string]: unknown;
  };
}

// --- Flex Message コンテナ ---
export type FlexContainer = FlexBubble | FlexCarousel;

export interface FlexBubble {
  type: "bubble";
  size?: "nano" | "micro" | "kilo" | "mega" | "giga";
  header?: FlexBox;
  hero?: FlexBox | FlexImage;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: {
    header?: { backgroundColor?: string };
    hero?: { backgroundColor?: string };
    body?: { backgroundColor?: string };
    footer?: { backgroundColor?: string };
  };
}

export interface FlexCarousel {
  type: "carousel";
  contents: FlexBubble[];
}

export interface FlexBox {
  type: "box";
  layout: "vertical" | "horizontal" | "baseline";
  contents: FlexComponent[];
  spacing?: string;
  padding?: string;
  backgroundColor?: string;
  cornerRadius?: string;
  [key: string]: unknown;
}

export interface FlexImage {
  type: "image";
  url: string;
  size?: string;
  aspectRatio?: string;
  aspectMode?: "cover" | "fit";
}

export type FlexComponent =
  | FlexBox
  | FlexText
  | FlexButton
  | FlexImage
  | FlexSeparator
  | FlexFiller;

export interface FlexText {
  type: "text";
  text: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "3xl" | "4xl" | "5xl";
  weight?: "regular" | "bold";
  color?: string;
  wrap?: boolean;
  flex?: number;
  margin?: string;
  align?: "start" | "end" | "center";
}

export interface FlexButton {
  type: "button";
  action: {
    type: "uri" | "message" | "postback";
    label: string;
    uri?: string;
    text?: string;
    data?: string;
  };
  style?: "primary" | "secondary" | "link";
  color?: string;
  height?: "sm" | "md";
  margin?: string;
}

export interface FlexSeparator {
  type: "separator";
  color?: string;
  margin?: string;
}

export interface FlexFiller {
  type: "filler";
}

// --- API リクエスト/レスポンス ---
export interface LinePushMessageRequest {
  to: string;
  messages: LineMessage[];
}

export interface LineReplyMessageRequest {
  replyToken: string;
  messages: LineMessage[];
}

export interface LineApiResponse {
  message?: string;
  sentMessages?: Array<{ id: string; quoteToken: string }>;
}

// --- 内部で使う送信ペイロード ---
export interface NotifyResultPayload {
  userId: string;       // LINE userId
  recordId: string;    // 診断レコードID
  userName: string;
  typeName: string;
  incomeUpRange: string;
  successRate: number;
  recommendedJobs: string[];
  bookingUrl: string;
}
