import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const PROMPT = `あなたは栄養士兼料理家です。一人暮らしの方のために、週7日分の夕食献立を考えてください。

制約条件：
- ナス、キノコ類（しいたけ・えのき・まいたけ・エリンギなど全種）、たけのこは絶対に使用しない
- ヘルシーで栄養バランスが良く、かつ美味しいこと
- 一人分（1人前）のレシピ
- 和食・洋食・中華などバランスよく組み合わせる
- 同じ食材をなるべく使い回して買い物の負担を減らす
- 食材の保存方法も含めた買い物リストを作成する

今週の夕食献立7日分と買い物リストを作成してください。
必ず以下のJSON形式のみで返してください。前後に説明文・コードブロック記号は不要です：

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
tagsは2〜3個で「和食」「洋食」「中華」「高タンパク」「低カロリー」「ヘルシー」「ボリューム」「時短」などを使用してください。
dayIndexは月曜日=0、火曜日=1、水曜日=2、木曜日=3、金曜日=4、土曜日=5、日曜日=6としてください。`;

export async function POST() {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY が設定されていません。Vercelの環境変数を確認してください。' },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(PROMPT);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSONが見つかりませんでした');
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
