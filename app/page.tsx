'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      // כאן ניתן לפנות לקריאת API עם GEMINI_API_KEY
      setResponse('מערכת שף חיים מוכנה לפעולה ומחוברת לכל משתני הסביבה!');
    } catch (error) {
      console.error(error);
      setResponse('תרחשה שגיאה בתקשורת עם השרת.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dir-rtl text-right" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">👨‍🍳 שף חיים - עוזר הבישול שלך</h1>
        <p className="text-gray-600 mb-6 text-center">הזן רכיבים או שאלה לקבלת מתכון והמלצות קולינריות</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="מה יש לך במקרר היום?"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none h-32"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 disabled:opacity-50"
          >
            {loading ? 'שף חיים חושב...' : 'צור מתכון'}
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-gray-800">
            <h2 className="font-bold mb-1">תשובת השף:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}
