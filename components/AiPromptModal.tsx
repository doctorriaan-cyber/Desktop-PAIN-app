import React, { useState, useEffect } from 'react';

interface AiPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  onSave: (prompt: string) => void;
}

export const AiPromptModal: React.FC<AiPromptModalProps> = ({ isOpen, onClose, prompt, onSave }) => {
  const [editedPrompt, setEditedPrompt] = useState(prompt);

  useEffect(() => {
    if (isOpen) {
      setEditedPrompt(prompt);
    }
  }, [isOpen, prompt]);

  if (!isOpen) return null;

  const handleSaveChanges = () => {
    onSave(editedPrompt);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-[#004D40] rounded-xl shadow-2xl p-8 w-full max-w-4xl mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-[#00796B] pb-3">
          <h2 className="text-2xl font-bold text-white">Edit AI Prompt</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        
        <div className="flex-grow min-h-0">
            <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="w-full h-[60vh] bg-[#003638] border border-[#00796B] text-white rounded-md p-3 text-sm focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none resize-none leading-relaxed font-mono"
                placeholder="Enter your AI prompt here..."
            />
        </div>

        <div className="mt-6 flex justify-end">
            <button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                Save Changes
            </button>
        </div>
      </div>
       <style>{`
          @keyframes fade-in-up { 0% { opacity: 0; transform: scale(0.9) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
