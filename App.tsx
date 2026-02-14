
import React, { useState } from 'react';
import { SURVEY_QUESTIONS, EDUCATIONAL_RESOURCES } from './constants';
import { askExpert } from './services/geminiService';
import { Message } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'survey' | 'ai' | 'thanks'>('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSurvey = () => {
    setCurrentStep(0);
    setAnswers({});
    setView('survey');
  };
  
  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [SURVEY_QUESTIONS[currentStep].id]: answer }));
    if (currentStep < SURVEY_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setView('thanks');
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessage: Message = { role: 'user', content: userInput };
    setChatMessages([...chatMessages, newMessage]);
    setUserInput("");
    setIsLoading(true);

    const responseText = await askExpert(userInput);
    setChatMessages(prev => [...prev, { role: 'assistant', content: responseText || "Қате орын алды." }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">🛡️</div>
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block tracking-tight">senym.kz</h1>
        </div>
        <nav className="flex gap-4">
          <button onClick={() => setView('landing')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Басты бет</button>
          <button onClick={() => setView('ai')} className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors">AI Көмекші</button>
        </nav>
      </header>

      <main>
        {view === 'landing' && (
          <div className="space-y-12 animate-fadeIn">
            <section className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Болашағың өз <span className="text-indigo-600">қолыңда</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Бұл платформа 9-10 сынып оқушыларына арналған. Біз саған есірткі мен зиянды әдеттер туралы ақпарат беруге және кез келген сұрағыңа анонимді түрде жауап беруге дайынбыз.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleStartSurvey}
                  className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
                >
                  Сауалнамадан өту (15 сұрақ)
                </button>
                <button 
                  onClick={() => setView('ai')}
                  className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-100 font-bold rounded-2xl hover:bg-indigo-50 transition-all"
                >
                  Маманнан сұрау
                </button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              {EDUCATIONAL_RESOURCES.map((res, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{res.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{res.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{res.description}</p>
                </div>
              ))}
            </section>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl">
              <div className="flex items-start gap-4">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-amber-800 mb-1">Анонимділік кепілдігі</h4>
                  <p className="text-amber-700 text-sm">
                    Біз ешқандай жеке деректерді жинамаймыз. Сауалнама нәтижелері тек жасөспірімдер арасындағы жағдайды талдау үшін қолданылады.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'survey' && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Сұрақ: {currentStep + 1} / {SURVEY_QUESTIONS.length}</span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500" 
                  style={{ width: `${((currentStep + 1) / SURVEY_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-8 leading-snug">
              {SURVEY_QUESTIONS[currentStep].text}
            </h3>

            <div className="space-y-4">
              {SURVEY_QUESTIONS[currentStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-5 rounded-2xl border-2 border-gray-50 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center gap-4 group"
                >
                  <span className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-medium text-gray-700">{option}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50">
              <p className="text-xs text-center text-gray-400">Жауаптарыңыз автоматты түрде сақталады.</p>
            </div>
          </div>
        )}

        {view === 'ai' && (
          <div className="flex flex-col h-[70vh] bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">🤖</div>
                <div>
                  <h3 className="font-bold">AI Психолог-Көмекші</h3>
                  <p className="text-xs text-indigo-100">Анонимді және қауіпсіз кеңес</p>
                </div>
              </div>
              <button onClick={() => setView('landing')} className="text-white/80 hover:text-white">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {chatMessages.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <p className="text-gray-400 italic">Сені қызықтыратын кез келген сұрақты қойсаң болады. Мысалы:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Есірткі неге зиян?", "Вейп зиянсыз ба?", "Тәуелділіктен қалай құтылуға болады?", "Досыма қалай көмектесемін?"].map(q => (
                      <button 
                        key={q} 
                        onClick={() => setUserInput(q)}
                        className="text-xs bg-white px-3 py-2 rounded-full border border-gray-200 hover:border-indigo-300 text-gray-600 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Сұрағыңды осы жерге жаз..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors font-bold"
              >
                Жіберу
              </button>
            </div>
          </div>
        )}

        {view === 'thanks' && (
          <div className="text-center space-y-8 bg-white p-12 rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto animate-fadeIn">
            <div className="text-7xl">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800">Рақмет! Сауалнама аяқталды.</h2>
            <p className="text-gray-600">
              Сенің жауаптарың біз үшін өте маңызды. Осы деректер жасөспірімдер арасындағы нашақорлықтың алдын алу стратегиясын жасауға көмектеседі.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setView('landing')}
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all"
              >
                Басты бетке қайту
              </button>
              <button 
                onClick={() => setView('ai')}
                className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                AI Көмекшіден кеңес алу
              </button>
            </div>
            <div className="pt-8 border-t border-gray-100 mt-8">
              <p className="text-sm text-gray-400 mb-2 font-bold">Көмек керек болса:</p>
              <p className="text-sm text-indigo-600">Сенім телефоны (150 немесе 111)</p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 text-center text-gray-400 text-sm pb-10">
        <p>© 2026 | senym.kz | Барлық құқықтар қорғалған</p>
      </footer>
    </div>
  );
};

export default App;
