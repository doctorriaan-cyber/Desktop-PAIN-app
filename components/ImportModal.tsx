import React, { useState, useRef, useEffect } from 'react';
import type { Patient, TheaterListInfo, Doctor, Hospital } from '../types.ts';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (info: TheaterListInfo, patients: Patient[]) => void;
  doctors: Doctor[];
  onAddDoctor: (name: string) => void;
  hospitals: Hospital[];
  onAddHospital: (name: string) => void;
}

declare const XLSX: any; // From CDN script

// Helper function to calculate the next weekday
const getNextWeekday = (): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Start with tomorrow

  while (tomorrow.getDay() === 6 || tomorrow.getDay() === 0) { // 6 = Saturday, 0 = Sunday
    tomorrow.setDate(tomorrow.getDate() + 1);
  }
  
  // Format to 'YYYY-MM-DD' which is required for the input type="date" value
  return tomorrow.toISOString().split('T')[0]; 
};


const FileUploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4DB6AC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, doctors, onAddDoctor, hospitals, onAddHospital }) => {
  const [step, setStep] = useState<number>(1);
  const [doctorName, setDoctorName] = useState<string>('');
  const [hospitalLocation, setHospitalLocation] = useState<string>('');
  const [date, setDate] = useState<string>(getNextWeekday());
  const [fileName, setFileName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for doctor autocomplete
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
  
  // State for hospital autocomplete
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filtered = doctors.filter(doc => 
      doc.name.toLowerCase().includes(doctorName.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctorName, doctors]);

  useEffect(() => {
    const filtered = hospitals.filter(h => 
      h.name.toLowerCase().includes(hospitalLocation.toLowerCase())
    );
    setFilteredHospitals(filtered);
  }, [hospitalLocation, hospitals]);

  if (!isOpen) return null;

  const resetState = () => {
    setStep(1);
    setDoctorName('');
    setHospitalLocation('');
    setDate(getNextWeekday());
    setFileName('');
    setFile(null);
    setIsLoading(false);
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleNextStep = () => {
    if (doctorName && hospitalLocation && date) {
      if (!doctors.some(doc => doc.name.toLowerCase() === doctorName.toLowerCase())) {
        onAddDoctor(doctorName);
      }
      if (!hospitals.some(h => h.name.toLowerCase() === hospitalLocation.toLowerCase())) {
        onAddHospital(hospitalLocation);
      }
      setError(null);
      setStep(2);
    } else {
      setError('All fields are required.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
    }
  };

  const handleFileParse = () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        if (json.length < 2) throw new Error("Spreadsheet is empty or has no data rows.");

        const parsedPatients: Patient[] = json.slice(1).map((row: any[]) => {
          let telephone = String(row[1] || '');
          if (telephone && /^\d+$/.test(telephone) && !telephone.startsWith('0')) {
            telephone = '0' + telephone;
          }
          const dobValue = row[2];
          let dob = '';
          if (dobValue instanceof Date) {
            const day = String(dobValue.getDate()).padStart(2, '0');
            const month = String(dobValue.getMonth() + 1).padStart(2, '0');
            const year = dobValue.getFullYear();
            dob = `${day}/${month}/${year}`;
          } else if (dobValue) {
            dob = String(dobValue);
          }
          return {
            name: row[0] || '', telephone, dob, email: row[3] || '', idNumber: row[4] || '',
            age: row[5] || '', medicalAidName: row[6] || '', medicalAidNumber: row[7] || '',
            dependantNumber: row[8] || '', gender: row[9] || '', authNumber: row[10] || '',
            icd10Codes: row[11] || '', procedureCodes: row[12] || '', procedureSummary: row[13] || '',
            weight: '',
            height: '',
            inTime: '',
            outTime: '',
            tci: '',
            ketamine: '',
            sedationType: 'Deep',
            caution: false,
            penicillinAllergy: false,
            previouslyDone: false,
            notes: Array(7).fill(''),
          };
        });
        
        const info: TheaterListInfo = { doctorName, hospitalLocation, date };
        onImport(info, parsedPatients);
        handleClose();
      } catch (err) {
        console.error("File parsing error:", err);
        setError(`Failed to parse file. Please ensure it's a valid .xlsx file. Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsLoading(false);
    }
    reader.readAsArrayBuffer(file);
  };
  
  const handleDoctorSelect = (name: string) => {
    setDoctorName(name);
    setIsDoctorDropdownOpen(false);
  }

  const handleHospitalSelect = (name: string) => {
    setHospitalLocation(name);
    setIsHospitalDropdownOpen(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-[#004D40] rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Import Theater List - Step {step} of 2</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        
        {error && <div className="bg-red-500 bg-opacity-50 text-white p-3 rounded-md mb-4">{error}</div>}

        {step === 1 && (
          <div>
            <div className="mb-4 relative">
              <label htmlFor="doctorName" className="block text-sm font-medium text-[#B2DFDB] mb-1">Doctor Name</label>
              <input 
                type="text" id="doctorName" value={doctorName} 
                onChange={(e) => setDoctorName(e.target.value)}
                onFocus={() => setIsDoctorDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDoctorDropdownOpen(false), 200)}
                autoComplete="off"
                className="w-full bg-[#003638] border border-[#00796B] text-white rounded-md p-2 focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none" 
              />
              {isDoctorDropdownOpen && filteredDoctors.length > 0 && (
                 <ul className="absolute z-20 w-full bg-[#003638] border border-[#00796B] rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                   {filteredDoctors.map(doc => (
                     <li 
                        key={doc.id}
                        onMouseDown={() => handleDoctorSelect(doc.name)}
                        className="p-2 text-white hover:bg-[#00695C] cursor-pointer"
                     >
                       {doc.name}
                     </li>
                   ))}
                 </ul>
              )}
            </div>
            <div className="mb-4 relative">
              <label htmlFor="hospitalLocation" className="block text-sm font-medium text-[#B2DFDB] mb-1">Hospital Location</label>
              <input 
                type="text" id="hospitalLocation" value={hospitalLocation} 
                onChange={(e) => setHospitalLocation(e.target.value)}
                onFocus={() => setIsHospitalDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsHospitalDropdownOpen(false), 200)}
                autoComplete="off"
                className="w-full bg-[#003638] border border-[#00796B] text-white rounded-md p-2 focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none" 
              />
              {isHospitalDropdownOpen && filteredHospitals.length > 0 && (
                 <ul className="absolute z-10 w-full bg-[#003638] border border-[#00796B] rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                   {filteredHospitals.map(h => (
                     <li 
                        key={h.id}
                        onMouseDown={() => handleHospitalSelect(h.name)}
                        className="p-2 text-white hover:bg-[#00695C] cursor-pointer"
                     >
                       {h.name}
                     </li>
                   ))}
                 </ul>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-[#B2DFDB] mb-1">Date</label>
                <div className="flex items-center space-x-2">
                    <input 
                    type="date" 
                    id="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="flex-grow bg-[#003638] border border-[#00796B] text-white rounded-md p-2 focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none custom-date-input"
                    />
                    <button
                    type="button"
                    onClick={() => setDate('')}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    aria-label="Clear date"
                    >
                    Clear
                    </button>
                </div>
            </div>
            <button onClick={handleNextStep} className="w-full bg-[#00796B] hover:bg-[#00695C] text-white font-bold py-2 px-4 rounded-lg transition duration-300">Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div 
              className="border-2 border-dashed border-[#00796B] rounded-lg p-8 mb-4 text-center cursor-pointer hover:bg-[#003638]"
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" accept=".xlsx" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <div className="flex flex-col items-center">
                <FileUploadIcon />
                {fileName ? (
                  <p className="mt-2 text-white">{fileName}</p>
                ) : (
                  <p className="mt-2 text-[#B2DFDB]">Click or drag to upload .xlsx file</p>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(1)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Back</button>
              <button onClick={handleFileParse} disabled={!file || isLoading} className="bg-[#00796B] hover:bg-[#00695C] text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center">
                {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>}
                {isLoading ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        )}
      </div>
       <style>{`
          @keyframes fade-in-up { 0% { opacity: 0; transform: scale(0.9) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
          .custom-date-input::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
          }
      `}</style>
    </div>
  );
};