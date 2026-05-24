"use client";

import { Butterfly_Kids } from "next/font/google";
import { useState } from "react";

export default function Home() {
    const [review, setReview] = useState("");
    const [reply, setReply] = useState("");
    const [tone, setTone] = useState("丁寧");
    const [loading, setLoading] = useState(false);

    const generateReply = async () => {
       // alert("generatereply 動いた");

        try {
            setLoading(true);

            const response = await fetch("/api/generate",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    review,
                    tone,
                }),
            });

            const data = await response.json();

            //alert(JSON.stringify(data));

            setReply(data.reply || "返信生成に失敗しました");
        } catch (error) {
            console.error(error);
            setReply("返信生成に失敗しました");
        } finally{
            setLoading(false);
        }
    };

    const copyReply = async () => {
        await 
        navigator.clipboard.writeText(reply);
        alert("コピーしました!");
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
            <h1 className="text-5xl font-bold mt-10">口コミ返信生成</h1>

            <p className="text-gray-400 txt-lg mt-4">
                口コミ内容に合わせて返信文を生成します
            </p>

            <div className="w-full max-w-2xl mt-10 flex flex-col gap-4">
                <textarea
                placeholder="口コミを入力してください"
                value={review}
                onChange={(e) =>
                    setReview(e.target.value)}
                    className="w-full h-48 rounded-2xl bg-zinc-900 border border-zinc-700 p-4 text-white"
            />

            <input 
            type="file"
            accept="image/*"
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-3"
            />

            <select
            value={tone}
            onChange={(e) =>
                setTone(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl p-3">
                    <option>丁寧</option>
                    <option>ビジネス敬語</option>
                    <option>大人っぽい</option>
                </select>

                <button
                onClick={generateReply}
                disabled={loading || !review}
                className="bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-700 py-4 rounded-2xl text-lg font-bold">
                    
                    {loading ? "生成中…" : "AIで返信を生成"}
                </button>

                <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 min-h-[200px]whitespace-pre-wrap">
                    {reply || "ここに返信が表示されます"}
                </div>

                {reply && (
                    <button
                    onClick={copyReply}
                    className="bg-white text-black py-3 rounded-xl font-bold">
                        コピーする
                    </button>
                )}
                </div>
        </main>
    );
}