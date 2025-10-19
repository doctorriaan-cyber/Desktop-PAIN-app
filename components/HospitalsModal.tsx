import React, { useState, useEffect } from 'react';
import type { Hospital } from '../types';

interface HospitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitals: Hospital[];
  onSave: (hospitals: Hospital[]) => void;
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


export const HospitalsModal: React.FC<HospitalsModalProps> = ({ isOpen, onClose, hospitals, onSave }) => {
  const [editableHospitals, setEditableHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    // Deep copy to prevent mutating original state
    if (isOpen) {
      setEditableHospitals(JSON.parse(JSON.stringify(hospitals)));
    }
  }, [isOpen, hospitals]);

  if (!isOpen) return null;

  const handleAddHospital = () => {
    setEditableHospitals([...editableHospitals, { id: Date.now(), name: '' }]);
  };

  const handleUpdateHospital = (index: number, value: string) => {
    const updatedHospitals = [...editableHospitals];
    updatedHospitals[index] = { ...updatedHospitals[index], name: value };
    setEditableHospitals(updatedHospitals);
  };

  const handleRemoveHospital = (id: number) => {
    setEditableHospitals(editableHospitals.filter(h => h.id !== id));
  };

  const handleSaveChanges = () => {
    // Filter out any empty hospital entries before saving
    const validHospitals = editableHospitals.filter(h => h.name.trim() !== '');
    onSave(validHospitals);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-[#004D40] rounded-xl shadow-2xl p-8 w-full max-w-2xl mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6 border-b border-[#00796B] pb-3">
          <h2 className="text-2xl font-bold text-white">Manage Hospitals</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-3">
            {editableHospitals.map((hospital, index) => (
                <div key={hospital.id} className="flex items-center space-x-3 p-2 rounded-md bg-black bg-opacity-20">
                    <input 
                        type="text" 
                        placeholder="Hospital Name"
                        value={hospital.name}
                        onChange={(e) => handleUpdateHospital(index, e.target.value)}
                        className="flex-grow bg-[#003638] border border-[#00796B] text-white rounded-md p-2 focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none"
                    />
                    <button onClick={() => handleRemoveHospital(hospital.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-800 rounded-full transition-colors">
                        <TrashIcon />
                    </button>
                </div>
            ))}
        </div>

        <div className="mt-6 flex justify-between">
            <button 
                onClick={handleAddHospital}
                className="flex items-center justify-center bg-[#00796B] hover:bg-[#00695C] text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
                <PlusIcon />
                Add a hospital
            </button>
            <button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                Save
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