import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `あなたは栄養士兼料理家です。一人暮らしの方のために、週7日分の夕食献立を考えてください。

制約条件：
- ナス、キノコ類（しいたけ・えのき・まいたけ・エリンギなど全種）、たけのこは絶対に使用しない
- ヘルシーで栄養バランスが良く、かつ美味しいこと
- 一人分（1人前）のレシピ
- 和食・洋食・中華などバランスよく組み合わせる
- 同じ食材をなるべく使い回して買い物の負担を減らす
- 食材の保存方法も含めた買い物リストを作成する

必ず以下のJSON形式で返してください。JSONのみを返し、前後に説明文は不要です：

{
  "meals": [
    {
      "id": "meal-1",
      "day": "月曜日",
      "dayIndex": 0,
      "name": "料理名",
      "description": "一言説明（40字以内）",
      "cookingTime": 30,
      "calories": 450,
      "tags": ["和食", "高タンパク"],
      "ingredients": [
        { "name": "食材名", "amount": "量" }
      ],
      "steps": [
        "手順1",
        "手順2"
      ]
    }
  ],
  "shoppingList": [
    {
      "name": "食材名",
      "amount": "合計量",
      "category": "肉・魚",
      "usedOnDays": ["月曜日", "水曜日"],
      "storageMethod": "冷蔵",
      "storageNote": "購入後3日以内に使用。木曜分は冷凍推奨"
    }
  ]
}

カテゴリーは「肉・魚」「野菜・果物」「豆腐・卵・乳製品」「調味料・乾物」「その他」のいずれかを使用してください。
tagsは2〜3個で「和食」「洋食」「中華」「高タンパク」「低カロリー」「ヘルシー」「ボリューム」「時短」などを使用してください。`;

export async function POST() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY が設定されていません。' },
      { status: 500 }
    );
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: '今週の夕食献立7日分と買い物リストを作成してください。',
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const text = content.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON not found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `献立の生成に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
