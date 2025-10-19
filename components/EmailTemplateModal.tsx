import React, { useState, useEffect } from 'react';

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerTemplate: string;
  bodyTemplate: string;
  onSave: (header: string, body: string) => void;
}

export const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({ isOpen, onClose, headerTemplate, bodyTemplate, onSave }) => {
  const [editedHeader, setEditedHeader] = useState(headerTemplate);
  const [editedBody, setEditedBody] = useState(bodyTemplate);

  useEffect(() => {
    if (isOpen) {
      setEditedHeader(headerTemplate);
      setEditedBody(bodyTemplate);
    }
  }, [isOpen, headerTemplate, bodyTemplate]);

  if (!isOpen) return null;

  const handleSaveChanges = () => {
    onSave(editedHeader, editedBody);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-[#004D40] rounded-xl shadow-2xl p-8 w-full max-w-4xl mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-[#00796B] pb-3">
          <h2 className="text-2xl font-bold text-white">Edit Email Template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-[#B2DFDB] mb-2">Email Header</label>
                <input
                    type="text"
                    value={editedHeader}
                    onChange={(e) => setEditedHeader(e.target.value)}
                    className="w-full bg-[#003638] border border-[#00796B] text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none font-mono"
                    placeholder="Enter email header template..."
                />
                 <p className="text-xs text-gray-400 mt-1">Use [date] and [hospital] as placeholders.</p>
            </div>
            <div>
                 <label className="block text-sm font-medium text-[#B2DFDB] mb-2">Email Body</label>
                <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={8}
                    className="w-full bg-[#003638] border border-[#00796B] text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none resize-y leading-relaxed font-mono"
                    placeholder="Enter email body template..."
                />
                 <p className="text-xs text-gray-400 mt-1">Use [doctor name] and [hospital name] as placeholders.</p>
            </div>
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