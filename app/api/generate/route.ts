import { error } from "console";

export async function POST(req: Request) {
 try{
        const body = await req.json();
        const review =body.review;

        const apiKey =
        process.env.GEMINI_API_KEY;
        
        if(!apiKey){
            return new Response(
                JSON.stringify({
                    error:"GEMINI_API_KEYが読み込めていません。.env.localを確認して、npm run devを再起動してください。",
                }),
                {
                    status: 500,
                    headers:{ "Content-Type":
                        "applocation/json"},
                    }
            );
        }
        
        const prompt = `
        あなたは。店舗スタッフとして、口コミへの返信文を作成します。
        
        以下を守ってください。
        
        ･口コミ本文の言葉をそのまま繰り返さない
        ･自然な日本語
        ･口コミを要約しない
        ･店舗として返信
        ･自然で暖かい日本語にする
        ･長文口コミには熱量高め
        ･短文口コミには簡潔に
        ･絵文字は自然に適度に使用
        ･口コミ内の具体ごは最大１つまで使って良い

        悪い例：
        「楽しかったとのお言葉ありがとうございます」
        「癒やされたと言っていただけて嬉しいです」
        「素敵なお時間を過ごしていただけたようで」
        「またのご利用をお待ちしております」

        返信の型は毎回ランダムに変えてください
        型名は出力しないでください

        口コミ：
        ${review}
        `;

        const response = await fetch(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
            
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [ { text: prompt }],
                        },
                    ],

                    generationConfig: {
                        temperature: 0.9,
                        topP: 0.95,
                        topK: 40,
                    }
                }),
            }
        );

        const data = await response.json();

        console.log(JSON.stringify(data,null,2));
        
        if(!response.ok) {
            return new Response(
                JSON.stringify({
                    error : data.error?.message ||
                    "Gemini APIでエラーが発生しました",
                }),
                {
                    status:500,
                    headers: {"Content-Type":"application/json"},
                }
            );
        }

        const reply = //JSON.stringify(data,null,2);

         data.candidates[0].content.parts[0].text ;

         return Response.json({
            reply,
         });
         
         return new Response(
            JSON.stringify({  reply  }),
            {
                headers: {"Content-Type": "application/json",},
        }
         );
    } catch (error) {
        return new Response(
            JSON.stringify( {
                error: String(error),
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}