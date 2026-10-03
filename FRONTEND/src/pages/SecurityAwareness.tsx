import React, { useState, useEffect } from 'react';
import { CheckCircle, Award } from 'lucide-react';
import { getTrainingModules } from '../services/api';
import type { TrainingModule, QuizQuestion } from '../types/phishguard';

export const SecurityAwareness: React.FC = () => {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    getTrainingModules().then(setModules);
  }, []);

  const handleStartQuiz = (mod: TrainingModule) => {
    setActiveQuiz(mod.questions);
    setSelectedAnswers({});
    setQuizScore(null);
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) correct++;
    });
    const scorePct = Math.round((correct / activeQuiz.length) * 100);
    setQuizScore(scorePct);

    if (activeModule) {
      setModules((prev) =>
        prev.map((m) => (m.id === activeModule.id ? { ...m, completed: true, score: scorePct } : m))
      );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      <div className="border-b border-[#5CE1E6]/15 pb-4">
        <h1 className="text-2xl font-bold font-mono text-[#EAF4FF]">Security Awareness Center</h1>
        <p className="text-xs font-mono text-[#8493A8]">Teachable Moments & Interactive Social Engineering Quizzes</p>
      </div>

      {/* MODULE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className="cyber-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="px-2 py-0.5 bg-[#0D1220] border border-[#5CE1E6]/20 text-[#5CE1E6] rounded">
                  {mod.topic}
                </span>
                <span className="text-[#8493A8]">{mod.duration}</span>
              </div>
              <h3 className="text-lg font-bold font-mono text-[#EAF4FF]">{mod.title}</h3>
              <p className="text-xs text-[#8493A8]">{mod.content[0]}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#5CE1E6]/10">
              {mod.completed ? (
                <div className="flex items-center justify-between text-xs font-mono text-[#43E59B]">
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Passed</span>
                  <span className="font-extrabold">{mod.score}%</span>
                </div>
              ) : (
                <button
                  onClick={() => { setActiveModule(mod); handleStartQuiz(mod); }}
                  className="w-full py-2 bg-[#5CE1E6] text-[#070A12] font-mono text-xs font-bold rounded hover:bg-white transition-all shadow-[0_0_10px_rgba(92,225,230,0.2)]"
                >
                  START LESSON & QUIZ
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* INTERACTIVE QUIZ MODAL */}
      {activeModule && activeQuiz && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="cyber-card max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#5CE1E6]/10 pb-3">
              <h3 className="text-lg font-mono font-bold text-[#5CE1E6]">
                Interactive Quiz: {activeModule.title}
              </h3>
              <button
                onClick={() => setActiveModule(null)}
                className="text-xs font-mono text-[#8493A8] hover:text-white"
              >
                CLOSE [X]
              </button>
            </div>

            {quizScore !== null ? (
              <div className="text-center py-6 space-y-4 font-mono">
                <Award className="w-12 h-12 text-[#43E59B] mx-auto" />
                <h4 className="text-2xl font-bold text-[#EAF4FF]">Quiz Complete!</h4>
                <p className="text-lg text-[#5CE1E6]">Score: {quizScore}%</p>
                <p className="text-xs text-[#8493A8]">
                  {quizScore >= 70 ? 'Your organization risk score has improved!' : 'Review the lesson and retake.'}
                </p>
                <button
                  onClick={() => setActiveModule(null)}
                  className="px-6 py-2 bg-[#5CE1E6] text-[#070A12] font-bold text-xs rounded"
                >
                  RETURN TO MODULES
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {activeQuiz.map((q, idx) => (
                  <div key={q.id} className="space-y-3">
                    <p className="text-xs font-mono font-bold text-[#EAF4FF]">
                      Q{idx + 1}: {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(idx, optIdx)}
                          className={`w-full text-left p-3 rounded text-xs font-mono border transition-all ${
                            selectedAnswers[idx] === optIdx
                              ? 'bg-[#5CE1E6]/10 border-[#5CE1E6] text-[#5CE1E6]'
                              : 'bg-[#080C15] border-[#5CE1E6]/10 text-[#8493A8] hover:border-[#5CE1E6]/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitQuiz}
                  className="w-full py-3 bg-[#5CE1E6] text-[#070A12] font-mono text-xs font-extrabold rounded hover:bg-white"
                >
                  SUBMIT ANSWERS
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAwareness;
