'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// הגדרת קליינט Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // יצירת מתכון באמצעות Gemini
  const generateRecipe = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setRecipe('');
    setSaved(false);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `אתה שף מקצועי בשם "שף חיים". תכין מתכון מפורט, טעים וברור בעברית בהתבסס על המרכיבים הבאים: ${ingredients}. כלול שם למנה, מצרכים ושלבי הכנה מפורטים.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const generatedText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'לא ניתן היה ליצור מתכון, נסה שוב.';
      setRecipe(generatedText);
    } catch (error) {
      console.error(error);
      setRecipe('אירעה שגיאה ביצירת המתכון. אנא בדוק את המפתחות והגדרות הרשת.');
    } finally {
      setLoading(false);
    }
  };

  // שמירת מתכון ב-Supabase
  const saveRecipe = async () => {
    if (!recipe) return;
    try {
      const { error } = await supabase.from('recipes').insert([
        { ingredients, recipe_text: recipe, created_at: new Date() },
      ]);

      if (error) throw error;
      setSaved(true);
    } catch (err) {
      console.error('שגיאה בשמירת המתכון:', err);
      alert('שגיאה בשמירה ל-Supabase. ודא שהטבלה recipes קיימת.');
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-orange-600 mb-2">👨‍🍳 שף חיים</h1>
          <p className="text-slate-600">הכנס את המרכיבים שיש לך בבית ולקבל מתכון שף מנצח!</p>
        </header>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              איזה מצרכים יש לך במקרר/מזווה?
            </label>
            <textarea
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none h-28"
              placeholder="למשל: חזה עוף, בצל, יין לבן, שום, קמח..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>

          <button
            onClick={generateRecipe}
            disabled={loading || !ingredients.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-md"
          >
            {loading ? 'שף חיים רוקח מתכון...' : 'צור מתכון ✨'}
          </button>
        </div>

        {recipe && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">המתכון שלך:</h2>
            <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 whitespace-pre-wrap text-slate-700 leading-relaxed">
              {recipe}
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={saveRecipe}
                disabled={saved}
                className="bg-slate-800 hover:bg-slate-900 disabled:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
              >
                {saved ? '✓ נשמר בהצלחה!' : 'שמור מתכון ב-Supabase 💾'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
