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
        あなたは口コミ返信のプロです。
        
        以下を守ってください。
        
        ･オウム返し禁止
        ･自然な日本語
        ･店舗として返信
        ･適度に親しみやすく
        ･口コミ内容をちゃんと理解する
        ･長文口コミには熱量高め
        ･短文口コミには簡潔に
        ･絵文字は自然に適度に使用

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