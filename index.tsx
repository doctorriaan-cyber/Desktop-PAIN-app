
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

// From types.ts
interface Patient {
  internalId: string;
  name: string;
  telephone: string;
  dob: string;
  email: string;
  idNumber: string;
  age: string;
  medicalAidName: string;
  medicalAidNumber: string;
  dependantNumber: string;
  gender: string;
  authNumber: string;
  icd10Codes: string;
  procedureCodes: string;
  procedureSummary: string;
  // New editable fields
  weight?: string;
  height?: string;
  inTime?: string;
  outTime?: string;
  tci?: string;
  ketamine?: string;
  sedationType?: 'Deep' | 'Awake';
  notes?: string[];
}

interface TheaterListInfo {
  doctorName: string;
  hospitalLocation: string;
  date: string;
}

interface TheaterList {
  id: number;
  info: TheaterListInfo;
  patients: Patient[];
}

interface Doctor {
  id: number;
  name: string;
  practiceNumber: string;
}

interface Hospital {
  id: number;
  name: string;
}

// From: components/WelcomeScreen.tsx
interface WelcomeScreenProps {
    onImportClick: () => void;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#4DB6AC] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-3-3m0 0l3-3m-3 3h12" />
    </svg>
);


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onImportClick }) => {
    return (
        <div className="text-center mt-20 flex flex-col items-center">
            <UploadIcon />
            <h2 className="text-3xl font-bold mb-2 text-white">No Patient Data Found</h2>
            <p className="text-lg text-[#B2DFDB] mb-6">
                Click the button below to import a theater list from an .xlsx file.
            </p>
            <button
                onClick={onImportClick}
                className="bg-[#00796B] hover:bg-[#00695C] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
                Import New List
            </button>
        </div>
    );
};

// From: components/Header.tsx
interface HeaderProps {
    onImportClick: () => void;
    onDoctorsClick: () => void;
    onHospitalsClick: () => void;
    onEditAiPromptClick: () => void;
    onEditEmailTemplateClick: () => void;
    aiPrompt: string;
}

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

const ClipboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onImportClick, onDoctorsClick, onHospitalsClick, onEditAiPromptClick, onEditEmailTemplateClick, aiPrompt }) => {
    const [copyButtonText, setCopyButtonText] = React.useState('Copy AI Prompt');
    
    const handleCopy = () => {
        navigator.clipboard.writeText(aiPrompt).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => {
                setCopyButtonText('Copy AI Prompt');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyButtonText('Copy Failed');
             setTimeout(() => {
                setCopyButtonText('Copy AI Prompt');
            }, 2000);
        });
    };
    
    return (
        <header className="bg-black bg-opacity-20 shadow-lg">
            <div className="container mx-auto flex justify-between items-center p-4">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
                    Patient List Manager
                </h1>
                <div className="flex items-center space-x-2 md:space-x-4">
                     <button
                        onClick={handleCopy}
                        className="flex items-center justify-center bg-[#26A69A] hover:bg-[#00897B] text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <ClipboardIcon />
                        {copyButtonText}
                    </button>
                     <button
                        onClick={onEditAiPromptClick}
                        className="flex items-center justify-center bg-[#26A69A] hover:bg-[#00897B] text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <PencilIcon />
                        Edit AI Prompt
                    </button>
                    <button
                        onClick={onEditEmailTemplateClick}
                        className="flex items-center justify-center bg-[#26A69A] hover:bg-[#00897B] text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <MailIcon />
                        Edit email text
                    </button>
                    <button
                        onClick={onHospitalsClick}
                        className="flex items-center justify-center bg-[#004D40] hover:bg-[#003638] text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <ListIcon />
                        Hospitals
                    </button>
                    <button
                        onClick={onDoctorsClick}
                        className="flex items-center justify-center bg-[#004D40] hover:bg-[#003638] text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <ListIcon />
                        Doctors
                    </button>
                    <button
                        onClick={onImportClick}
                        className="flex items-center justify-center bg-[#00796B] hover:bg-[#00695C] text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <PlusIcon />
                        Import List
                    </button>
                </div>
            </div>
        </header>
    );
};

// From: components/ImportModal.tsx
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

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, doctors, onAddDoctor, hospitals, onAddHospital }) => {
  const [step, setStep] = React.useState<number>(1);
  const [doctorName, setDoctorName] = React.useState<string>('');
  const [hospitalLocation, setHospitalLocation] = React.useState<string>('');
  const [date, setDate] = React.useState<string>(getNextWeekday());
  const [fileName, setFileName] = React.useState<string>('');
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [parsedPatients, setParsedPatients] = React.useState<(Patient & { isSelected: boolean })[]>([]);

  // State for doctor autocomplete
  const [filteredDoctors, setFilteredDoctors] = React.useState<Doctor[]>([]);
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = React.useState(false);
  
  // State for hospital autocomplete
  const [filteredHospitals, setFilteredHospitals] = React.useState<Hospital[]>([]);
  const [isHospitalDropdownOpen, setIsHospitalDropdownOpen] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const filtered = doctors.filter(doc => 
      doc.name.toLowerCase().includes(doctorName.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctorName, doctors]);

  React.useEffect(() => {
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
    setParsedPatients([]);
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

        const localParsedPatients: Patient[] = json.slice(1).map((row: any[], index: number) => {
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
            internalId: `${Date.now()}-${index}`,
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
            notes: Array(7).fill(''),
          };
        });
        
        setParsedPatients(localParsedPatients.map(p => ({...p, isSelected: true})));
        setStep(3);
        setIsLoading(false);
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
  
  const handleConfirmImport = () => {
    const info: TheaterListInfo = { doctorName, hospitalLocation, date };
    const selectedPatients = parsedPatients.filter(p => p.isSelected).map(({isSelected, ...rest}) => rest);
    onImport(info, selectedPatients);
    handleClose();
  };

  const handleDoctorSelect = (name: string) => {
    setDoctorName(name);
    setIsDoctorDropdownOpen(false);
  }

  const handleHospitalSelect = (name: string) => {
    setHospitalLocation(name);
    setIsHospitalDropdownOpen(false);
  }

  const handleTogglePatientSelection = (patientIndex: number) => {
    setParsedPatients(currentPatients => 
      currentPatients.map((p, index) => 
        index === patientIndex ? { ...p, isSelected: !p.isSelected } : p
      )
    );
  };

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setParsedPatients(currentPatients => 
      currentPatients.map(p => ({ ...p, isSelected: checked }))
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-[#004D40] rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Import Theater List - Step {step} of 3</h2>
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
                {isLoading ? 'Parsing...' : 'Parse File'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-lg text-white mb-2">Found {parsedPatients.length} patients. Uncheck any patients you do not want to import:</p>
            <div className="bg-[#003638] p-3 rounded-md max-h-60 overflow-y-auto mb-6">
              <div className="flex items-center p-1 mb-2 border-b border-[#00796B]">
                  <input
                      type="checkbox"
                      id="import-select-all"
                      className="h-4 w-4 mr-3 bg-[#003638] border-[#00796B] text-[#26A69A] rounded focus:ring-[#4DB6AC]"
                      checked={parsedPatients.every(p => p.isSelected) && parsedPatients.length > 0}
                      onChange={handleToggleSelectAll}
                  />
                  <label htmlFor="import-select-all" className="text-white font-bold">Select All</label>
              </div>
              <ul className="space-y-1">
                {parsedPatients.map((p, index) => (
                  <li key={p.idNumber || index} className="text-white flex items-center p-1 rounded hover:bg-black hover:bg-opacity-20 cursor-pointer" onClick={() => handleTogglePatientSelection(index)}>
                     <input
                        type="checkbox"
                        className="h-4 w-4 mr-3 bg-[#003638] border-[#00796B] text-[#26A69A] rounded focus:ring-[#4DB6AC] pointer-events-none"
                        checked={p.isSelected}
                        readOnly
                    />
                    {p.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(2)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Back</button>
              <button onClick={handleConfirmImport} className="bg-[#00796B] hover:bg-[#00695C] text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                  Confirm Import ({parsedPatients.filter(p => p.isSelected).length} selected)
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

// From: components/PatientRow.tsx
interface PatientRowProps {
  patient: Patient;
  index: number;
  onUpdate: (updatedData: Partial<Patient>) => void;
  expandCollapseSignal: { version: number; expand: boolean };
}

const DataItem: React.FC<{ label: string; value: string | undefined, isCode?: boolean }> = ({ label, value, isCode = false }) => (
    <div className="flex-1 min-w-[120px] px-2 py-0.5">
      <p className="text-xs text-[#80CBC4] uppercase tracking-wide">{label}</p>
      <p className={`text-sm text-white truncate ${isCode ? 'font-mono' : ''}`}>{value || 'N/A'}</p>
    </div>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-xs text-[#80CBC4] uppercase tracking-wide mb-1">{label}</label>
        <input 
            {...props}
            className="w-full bg-[#003638] border border-[#00796B] text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none"
        />
    </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-xs text-[#80CBC4] uppercase tracking-wide mb-1">{label}</label>
        <select 
            {...props}
            className="w-full bg-[#003638] border border-[#00796B] text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none"
        >
            {children}
        </select>
    </div>
);

const FormCheckbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="flex items-center">
        <input 
            type="checkbox"
            {...props}
            className="h-4 w-4 bg-[#003638] border-[#00796B] text-[#26A69A] rounded focus:ring-[#4DB6AC]"
        />
        <label className="ml-2 text-sm text-white">{label}</label>
    </div>
);

const PatientChevronIcon: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);


const PatientRow: React.FC<PatientRowProps> = ({ patient, index, onUpdate, expandCollapseSignal }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    
    React.useEffect(() => {
        setIsExpanded(expandCollapseSignal.expand);
    }, [expandCollapseSignal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            onUpdate({ [name]: checked });
        } else {
            onUpdate({ [name]: value });
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let cleanedValue = value.replace(/\D/g, '');
        if (cleanedValue.length > 2) {
            cleanedValue = cleanedValue.slice(0, 2) + ':' + cleanedValue.slice(2, 4);
        }
        onUpdate({ [name]: cleanedValue });
    };

    const handleNoteChange = (noteIndex: number, value: string) => {
        const newNotes = [...(patient.notes || Array(7).fill(''))];
        newNotes[noteIndex] = value;
        onUpdate({ notes: newNotes });
    };

    const calculateBmi = () => {
        const weight = parseFloat(patient.weight || '0');
        const height = parseFloat(patient.height || '0');

        if (weight > 0 && height > 0) {
            const bmi = weight / (height * height);
            return bmi.toFixed(1);
        }
        return 'N/A';
    };

    return (
        <div className="p-3 hover:bg-black hover:bg-opacity-20 transition-colors duration-200">
            {/* Collapsed View / Header */}
            <div 
                className="cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Top row with flex layout */}
                <div className="flex flex-wrap items-center justify-between">
                    {/* Left side: Name and stats, allowed to grow and wrap */}
                    <div className="flex-grow flex items-center flex-wrap">
                        <div className="flex items-center flex-shrink-0 mr-4">
                            <div className="flex-shrink-0 w-8 h-8 mr-3 bg-[#00796B] rounded-full flex items-center justify-center text-white font-bold">
                                {index + 1}
                            </div>
                            <p className="text-lg font-bold text-white">{patient.name}</p>
                        </div>
                        
                        <div className="flex items-center flex-wrap flex-shrink-0 [&>div]:!flex-initial [&>div]:!min-w-0">
                            <DataItem label="Age" value={patient.age} />
                            <DataItem label="Gender" value={patient.gender} />
                            <DataItem label="Weight (kg)" value={patient.weight} />
                            <DataItem label="Height (m)" value={patient.height} />
                            <DataItem label="BMI" value={calculateBmi()} />
                        </div>
                    </div>

                    {/* Right side: Chevron icon, does not shrink */}
                    <div className="ml-4 flex-shrink-0">
                         <PatientChevronIcon isExpanded={isExpanded} />
                    </div>
                </div>

                {/* Second row for procedure */}
                <div className="mt-2 pl-11"> {/* Indent to align with name */}
                    <DataItem label="Procedure" value={patient.procedureSummary} />
                </div>
            </div>

            {/* Expanded View */}
            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#003638]">
                    {/* Original Data Details */}
                    <div className="flex flex-wrap items-start my-1">
                        <DataItem label="Telephone" value={patient.telephone} />
                        <DataItem label="Date of Birth" value={patient.dob} />
                        <DataItem label="Email" value={patient.email} />
                        <DataItem label="ID Number" value={patient.idNumber} isCode={true} />
                    </div>

                    <div className="flex flex-wrap items-start mt-1 pt-1 border-t border-[#003638]">
                        <DataItem label="Medical Aid" value={patient.medicalAidName} />
                        <DataItem label="MA Number" value={patient.medicalAidNumber} isCode={true} />
                        <DataItem label="Dependant #" value={patient.dependantNumber} isCode={true} />
                        <DataItem label="Auth #" value={patient.authNumber} isCode={true} />
                        <DataItem label="ICD10 Codes" value={patient.icd10Codes} isCode={true} />
                        <DataItem label="Procedure Codes" value={patient.procedureCodes} isCode={true} />
                    </div>

                    {/* New Form Section */}
                    <div className="mt-4 pt-3 border-t-2 border-dashed border-[#00796B]">
                        <div className="flex space-x-6">
                            {/* Left Column */}
                            <div className="w-1/4 space-y-3">
                                <FormInput label="Weight (kg)" name="weight" value={patient.weight || ''} onChange={handleChange} type="number" />
                                <FormInput label="Height (m)" name="height" value={patient.height || ''} onChange={handleChange} type="number" step="0.01" />
                                <FormInput label="In Time" name="inTime" value={patient.inTime || ''} onChange={handleTimeChange} type="text" placeholder="HH:MM" maxLength={5} />
                                <FormInput label="Out Time" name="outTime" value={patient.outTime || ''} onChange={handleTimeChange} type="text" placeholder="HH:MM" maxLength={5} />
                                <FormSelect label="Sedation Type" name="sedationType" value={patient.sedationType || 'Deep'} onChange={handleChange}>
                                    <option value="Deep">Deep</option>
                                    <option value="Awake">Awake</option>
                                </FormSelect>
                                <FormInput label="TCI" name="tci" value={patient.tci || ''} onChange={handleChange} />
                                <FormInput label="Ketamine" name="ketamine" value={patient.ketamine || ''} onChange={handleChange} />
                            </div>
                            
                            {/* Right Column */}
                             <div className="w-3/4">
                                <div className="space-y-4">
                                    <FormInput 
                                        label="Procedure" 
                                        name="procedureSummary" 
                                        value={patient.procedureSummary || ''} 
                                        onChange={handleChange}
                                    />
                                    <FormInput 
                                        label="Procedure Codes" 
                                        name="procedureCodes" 
                                        value={patient.procedureCodes || ''} 
                                        onChange={handleChange}
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-[#B2DFDB] mb-2">Patient Notes</label>
                                        <div className="space-y-2">
                                            {(patient.notes || Array(7).fill('')).map((note, i) => (
                                                <input 
                                                    key={i}
                                                    type="text"
                                                    value={note}
                                                    onChange={(e) => handleNoteChange(i, e.target.value)}
                                                    placeholder=""
                                                    className="w-full bg-[#003638] border border-[#00796B] text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// From: components/PatientTable.tsx
interface PatientTableProps {
  info: TheaterListInfo;
  patients: Patient[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onUpdatePatient: (patientInternalId: string, updatedData: Partial<Patient>) => void;
  expandCollapseSignal: { version: number; expand: boolean };
}

const InfoCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="bg-black bg-opacity-20 p-3 rounded-lg text-center">
    <p className="text-sm font-semibold text-[#80CBC4] uppercase tracking-wider">{title}</p>
    <p className="text-lg font-bold text-white">{value}</p>
  </div>
);

const ChevronIcon: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-white transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);


const PatientTable: React.FC<PatientTableProps> = ({ info, patients, isCollapsed, onToggleCollapse, onUpdatePatient, expandCollapseSignal }) => {
  return (
    <div className="bg-[#004D40] bg-opacity-50 rounded-xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Table Header */}
      <div 
        className="p-4 bg-black bg-opacity-20 border-b border-[#00796B] cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Theater List Details</h2>
            <ChevronIcon isCollapsed={isCollapsed} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard title="Doctor" value={info.doctorName} />
          <InfoCard title="Hospital" value={info.hospitalLocation} />
          <InfoCard title="Date" value={new Date(info.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
        </div>
      </div>

      {/* Patients List */}
      {!isCollapsed && (
        <div className="divide-y divide-[#00796B]">
          {patients.map((patient, index) => (
            <PatientRow 
              key={patient.internalId}
              patient={patient}
              index={index}
              onUpdate={(data) => onUpdatePatient(patient.internalId, data)}
              expandCollapseSignal={expandCollapseSignal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// From: components/ActionPanel.tsx
interface ActionPanelProps {
    list: TheaterList;
    doctors: Doctor[];
    onDeleteClick: () => void;
    onOpenQuickImportModal: (listId: number) => void;
    emailHeaderTemplate: string;
    emailBodyTemplate: string;
}

declare const jspdf: any;

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; variant?: 'primary' | 'danger'; className?: string, disabled?: boolean }> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
    const baseClasses = "w-full text-center justify-center font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center";
    const variantClasses = {
        primary: "bg-[#00796B] hover:bg-[#00695C] text-white",
        danger: "bg-red-700 hover:bg-red-600 text-white",
    };
    const disabledClasses = "disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none";

    return (
        <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabledClasses}`} disabled={disabled}>
            {children}
        </button>
    );
};

const ExportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
const ImportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const PdfIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const LoadingSpinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>;

const ActionSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-sm font-bold text-[#80CBC4] uppercase tracking-wider mb-2">{title}</h4>
        {children}
    </div>
);

const ActionPanel: React.FC<ActionPanelProps> = ({ list, doctors, onDeleteClick, onOpenQuickImportModal, emailHeaderTemplate, emailBodyTemplate }) => {
    const [headerCopyText, setHeaderCopyText] = React.useState('Copy Header');
    const [bodyCopyText, setBodyCopyText] = React.useState('Copy Body');
    const [isCreatingPdfs, setIsCreatingPdfs] = React.useState(false);
    
    const handleExportQuickData = () => {
        const wb = XLSX.utils.book_new();
        const ws_data: { [key: string]: any } = {};

        list.patients.forEach((patient, index) => {
            const start_row = 1 + (index * 12);

            const addCell = (col: number, row: number, value: any) => {
                const cell_ref = XLSX.utils.encode_cell({ c: col, r: row - 1 }); // zero-indexed row/col
                ws_data[cell_ref] = { t: 's', v: value ?? '' };
            };

            const M = 12; // M is column 13
            const K = 10; // K is column 11
            const N = 13; // N is column 14
            const P = 15; // P is column 16

            // Patient data
            addCell(M, start_row, patient.name);
            addCell(N, start_row, patient.age);
            (patient.notes || Array(7).fill('')).forEach((note, i) => {
                addCell(M, start_row + 1 + i, note);
            });
            addCell(M, start_row + 8, patient.procedureSummary);
            addCell(K, start_row + 3, patient.inTime);
            addCell(K, start_row + 4, patient.outTime);
            addCell(K, start_row + 5, patient.weight);
            addCell(K, start_row + 6, patient.height);
            addCell(K, start_row + 7, patient.sedationType);
            addCell(K, start_row + 8, patient.tci);
            addCell(N, start_row + 10, patient.ketamine);

            // List info for each patient block
            addCell(P, start_row + 1, list.info.doctorName);
            addCell(P, start_row + 3, list.info.hospitalLocation);
        });

        const ws = XLSX.utils.aoa_to_sheet([]);
        ws['!ref'] = 'A1:P100'; // Set a sufficiently large default range
        Object.keys(ws_data).forEach(key => {
            ws[key] = ws_data[key];
        });
        
        XLSX.utils.book_append_sheet(wb, ws, "Quick Data");

        const doctorNameParts = list.info.doctorName.split(' ');
        const doctorSurname = doctorNameParts.length > 1 ? doctorNameParts[doctorNameParts.length - 1] : doctorNameParts[0];
        const hospitalNameParts = list.info.hospitalLocation.split(' ');
        const hospitalFirstWord = hospitalNameParts[0];
        const fileName = `${doctorSurname}, ${hospitalFirstWord}, incomplete.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    const copyToClipboard = (text: string, setText: React.Dispatch<React.SetStateAction<string>>, originalText: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setText('Copied!');
            setTimeout(() => setText(originalText), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setText('Copy Failed');
            setTimeout(() => setText(originalText), 2000);
        });
    };

    const handleCopyEmailHeader = () => {
        const formattedDate = new Date(list.info.date + 'T00:00:00').toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        const text = emailHeaderTemplate
            .replace(/\[date\]/g, formattedDate)
            .replace(/\[hospital\]/g, list.info.hospitalLocation);
        copyToClipboard(text, setHeaderCopyText, 'Copy Email Header');
    };

    const handleCopyEmailBody = () => {
        const text = emailBodyTemplate
            .replace(/\[doctor name\]/g, list.info.doctorName)
            .replace(/\[hospital name\]/g, list.info.hospitalLocation);
        copyToClipboard(text, setBodyCopyText, 'Copy Email Body');
    };
    
    const handleCreatePdfs = async () => {
        if (isCreatingPdfs) return;
        setIsCreatingPdfs(true);
        try {
            if (!list.patients || list.patients.length === 0) {
                alert("No patients in this list to generate PDFs for.");
                setIsCreatingPdfs(false);
                return;
            }

            const leftMargin = 40;
            const lineSpacing = 12;
            const { jsPDF } = jspdf;

            const drawDoctorHeader = (doc: any, yPos: number) => {
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(16);
                doc.text('Dr Riaan Combrinck', leftMargin, yPos);
                yPos += 18;
                doc.setFont('Helvetica', 'normal');
                doc.setFontSize(9);
                const smallLineSpacing = 11;
                doc.text('GP Anaesthetist', leftMargin, yPos);
                yPos += smallLineSpacing;
                doc.text('MBChB (Pret 2016), DA (SA 2020), ATLS, ACLS, PALS, BLS', leftMargin, yPos);
                yPos += smallLineSpacing;
                doc.text('MP: 0847003, PP: 0920479', leftMargin, yPos);
                yPos += smallLineSpacing;
                doc.text('Email: drcombrinck@healthcollectiveheal.com', leftMargin, yPos);
                return yPos; // Return the final y position
            };

            const drawPatientSticker = (doc: any, patient: Patient, yPos: number) => {
                const pageWidth = doc.internal.pageSize.getWidth();
                const stickerX = pageWidth / 2 + 20;
                const stickerLabelWidth = 100;
                let stickerY = yPos;
                doc.setFontSize(10);

                const drawStickerField = (label: string, value: any) => {
                    doc.setFont('Helvetica', 'bold');
                    doc.text(String(label), stickerX, stickerY);
                    doc.setFont('Helvetica', 'normal');
                    const splitValue = doc.splitTextToSize(String(value || 'N/A'), pageWidth - stickerX - stickerLabelWidth - 10);
                    doc.text(splitValue, stickerX + stickerLabelWidth, stickerY);
                    stickerY += (splitValue.length * lineSpacing);
                };
                
                const stickerStartY = stickerY;
                drawStickerField('Patient Name:', patient.name);
                drawStickerField('Tel Number:', patient.telephone);
                drawStickerField('Email:', patient.email);
                drawStickerField('ID:', String(patient.idNumber));
                drawStickerField('Date of Birth:', patient.dob);
                drawStickerField('Age:', String(patient.age));
                drawStickerField('Medical Aid:', patient.medicalAidName);
                drawStickerField('Medical Aid No:', String(patient.medicalAidNumber));
                drawStickerField('Dependant Code:', String(patient.dependantNumber));
                drawStickerField('Gender:', patient.gender);
                drawStickerField('Auth Number:', String(patient.authNumber));
                drawStickerField('Procedure:', patient.procedureSummary);
                
                const stickerHeight = stickerY - stickerStartY + lineSpacing;
                doc.setDrawColor(0, 0, 0);
                doc.rect(stickerX - 10, stickerStartY - lineSpacing, pageWidth - stickerX, stickerHeight);
                return stickerY;
            };

            // Phase 1: Create all Billing Sheets
            list.patients.forEach(patient => {
                const billingDoc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
                billingDoc.setProperties({
                    title: `Billing Sheet - ${patient.name}`,
                    subject: `Billing information for procedure on ${new Date(list.info.date + 'T00:00:00').toLocaleDateString('en-GB')}`,
                    author: 'Dr Riaan Combrinck',
                    creator: 'Patient List Manager'
                });
                billingDoc.setFont('Helvetica', 'normal');
                billingDoc.setTextColor(0, 0, 0);
                const pageWidth = billingDoc.internal.pageSize.getWidth();
                billingDoc.setFont('Helvetica', 'bold');
                billingDoc.setFontSize(22);
                billingDoc.text('Billing sheet', pageWidth / 2, 40, { align: 'center' });
                const headerEndY = drawDoctorHeader(billingDoc, 80);
                const stickerEndY = drawPatientSticker(billingDoc, patient, 80);
                
                let tableY = Math.max(headerEndY, stickerEndY) + 30;
                const tableX = leftMargin;
                const tableWidth = pageWidth - leftMargin * 2;
                const col1Width = 120;
                const col2Width = tableWidth - col1Width;
                const rowHeight = 25;
                const textOffsetY = 16;
                const surgeon = doctors.find(d => d.name === list.info.doctorName);
                const surgeonText = surgeon ? `${surgeon.name} (${surgeon.practiceNumber})` : list.info.doctorName;
                const weight = parseFloat(patient.weight || '0');
                const height = parseFloat(patient.height || '0');
                let bmi = 'N/A';
                if (weight > 0 && height > 0) bmi = (weight / (height * height)).toFixed(1);
                const staticCodes = ['0151', '0023', '0032'];
                if (parseFloat(bmi) > 35) staticCodes.push('0018');
                if (parseInt(String(patient.age || '0'), 10) > 70) staticCodes.push('0043');
                const procedureCodes = String(patient.procedureCodes || 'N/A');
                let mainCode = '2313';
                if (procedureCodes.includes('2927')) mainCode = '2927';
                else if (procedureCodes.includes('2793')) mainCode = '2793';
                const procedureCodesValue = `Main code: ${mainCode}            All codes: (${procedureCodes})`;

                const tableData = [
                    { label: 'Date', value: new Date(list.info.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                    { label: 'Hospital Name', value: list.info.hospitalLocation },
                    { label: 'Surgeon', value: surgeonText },
                    { label: 'ICD 10 Codes', value: String(patient.icd10Codes || 'N/A') },
                    { label: 'Procedure Codes', value: procedureCodesValue },
                    { 
                        label: 'Time', 
                        value: [
                            { text: 'In:', bold: true },
                            { text: ` ${patient.inTime || 'N/A'}  `, bold: false },
                            { text: 'Out:', bold: true },
                            { text: ` ${patient.outTime || 'N/A'}`, bold: false }
                        ]
                    },
                    { 
                        label: 'BMI', 
                        value: [
                            { text: 'W:', bold: true },
                            { text: ` ${patient.weight || 'N/A'}kg  `, bold: false },
                            { text: 'H:', bold: true },
                            { text: ` ${patient.height || 'N/A'}m  `, bold: false },
                            { text: 'BMI:', bold: true },
                            { text: ` ${bmi}`, bold: false }
                        ]
                    },
                    { label: 'Procedure Codes', value: staticCodes.join(', ')}
                ];

                tableData.forEach((row, index) => {
                    billingDoc.rect(tableX, tableY, tableWidth, rowHeight);
                    billingDoc.line(tableX + col1Width, tableY, tableX + col1Width, tableY + rowHeight);
                    billingDoc.setFont('Helvetica', 'bold');
                    if (index === 7 && row.label === 'Procedure Codes') billingDoc.setTextColor(0, 0, 255); else billingDoc.setTextColor(0, 0, 0);
                    billingDoc.text(row.label, tableX + 5, tableY + textOffsetY);
                    billingDoc.setTextColor(0, 0, 0); 

                    const valueX = tableX + col1Width + 5;
                    const valueY = tableY + textOffsetY;

                    if (Array.isArray(row.value)) {
                        let currentX = valueX;
                        (row.value as { text: string; bold: boolean }[]).forEach(part => {
                            billingDoc.setFont('Helvetica', part.bold ? 'bold' : 'normal');
                            billingDoc.text(part.text, currentX, valueY);
                            currentX += billingDoc.getTextWidth(part.text);
                        });
                    } else {
                        billingDoc.setFont('Helvetica', 'normal');
                        const valueText = billingDoc.splitTextToSize(String(row.value), col2Width - 10);
                        billingDoc.text(valueText, valueX, valueY - (valueText.length > 1 ? 5 : 0));
                    }
                    tableY += rowHeight;
                });
                billingDoc.save(`Billing ${patient.name}.pdf`);
            });
            
            // Pause for 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Phase 2: Create all Sedation Records
            list.patients.forEach(patient => {
                const sedationDoc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
                sedationDoc.setProperties({
                    title: `Sedation Record - ${patient.name}`,
                    subject: `Sedation record for procedure on ${new Date(list.info.date + 'T00:00:00').toLocaleDateString('en-GB')}`,
                    author: 'Dr Riaan Combrinck',
                    creator: 'Patient List Manager'
                });
                sedationDoc.setFont('Helvetica', 'normal');
                sedationDoc.setTextColor(0, 0, 0);
                const pageWidth = sedationDoc.internal.pageSize.getWidth();
                sedationDoc.setFont('Helvetica', 'bold');
                sedationDoc.setFontSize(22);
                sedationDoc.text('Sedation Record', pageWidth / 2, 40, { align: 'center' });
                const sedHeaderEndY = drawDoctorHeader(sedationDoc, 80);
                const sedStickerEndY = drawPatientSticker(sedationDoc, patient, 80);

                let yPos = Math.max(sedHeaderEndY, sedStickerEndY) + 20;

                sedationDoc.setFontSize(10);
                const surgeon = doctors.find(d => d.name === list.info.doctorName);
                const surgeonText = surgeon ? `${surgeon.name} (${surgeon.practiceNumber})` : list.info.doctorName;
                const formattedDate = new Date(list.info.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                const infoFields = [
                    { label: 'Surgeon:', value: surgeonText },
                    { label: 'Hospital:', value: list.info.hospitalLocation },
                    { label: 'Date:', value: formattedDate }
                ];

                infoFields.forEach(({label, value}) => {
                    sedationDoc.setFont('Helvetica', 'bold');
                    sedationDoc.text(label, leftMargin, yPos);
                    sedationDoc.setFont('Helvetica', 'normal');
                    const splitValue = sedationDoc.splitTextToSize(String(value || 'N/A'), pageWidth - leftMargin * 2 - 80);
                    sedationDoc.text(splitValue, leftMargin + 80, yPos);
                    yPos += (splitValue.length * (lineSpacing + 2));
                });

                yPos += lineSpacing / 2;
                sedationDoc.setDrawColor(180, 180, 180);
                sedationDoc.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
                yPos += lineSpacing;
                
                const weight = parseFloat(patient.weight || '0');
                const height = parseFloat(patient.height || '0');
                let bmi = 'N/A';
                if (weight > 0 && height > 0) bmi = (weight / (height * height)).toFixed(1);

                const parseTime = (timeStr?: string) => {
                    if (!timeStr || !/^\d{1,2}:\d{2}$/.test(timeStr)) return null;
                    const [hours, minutes] = timeStr.split(':').map(Number);
                    const date = new Date(0);
                    date.setHours(hours, minutes, 0, 0);
                    return date;
                };

                const inDate = parseTime(patient.inTime);
                const outDate = parseTime(patient.outTime);
                let totalTime = 'N/A';
                if (inDate && outDate) {
                    let diffMs = outDate.getTime() - inDate.getTime();
                    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
                    const totalMinutes = Math.round(diffMs / 60000);
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    totalTime = `${hours}h ${minutes}m`;
                }

                const metrics = [
                    { label: 'DOB:', value: patient.dob },
                    { label: 'Age:', value: String(patient.age) },
                    { label: 'Weight:', value: `${patient.weight || 'N/A'} kg` },
                    { label: 'Height:', value: `${patient.height || 'N/A'} m` },
                    { label: 'BMI:', value: bmi },
                    { label: 'Sedation type:', value: patient.sedationType },
                    { label: 'TCI:', value: patient.tci },
                    { label: 'Ketamine:', value: patient.ketamine },
                    { label: 'In:', value: patient.inTime },
                    { label: 'Out:', value: patient.outTime },
                    { label: 'Total time:', value: totalTime },
                ];
                sedationDoc.setFontSize(10);
                metrics.forEach(({label, value}) => {
                    sedationDoc.setFont('Helvetica', 'bold');
                    sedationDoc.text(label, leftMargin, yPos);
                    sedationDoc.setFont('Helvetica', 'normal');
                    sedationDoc.text(String(value || 'N/A'), leftMargin + 80, yPos);
                    yPos += lineSpacing + 2;
                });
                yPos += lineSpacing;

                sedationDoc.setFont('Helvetica', 'bold');
                sedationDoc.text('Patient Notes:', leftMargin, yPos);
                yPos += lineSpacing + 2;
                sedationDoc.setFont('Helvetica', 'normal');
                (patient.notes || []).forEach(note => {
                    if (note) {
                        sedationDoc.text(`- ${note}`, leftMargin + 10, yPos);
                        yPos += lineSpacing + 2;
                    }
                });
                yPos += lineSpacing;

                sedationDoc.setFont('Helvetica', 'bold');
                sedationDoc.text(`Anaesthetic management: Sedation type: ${patient.sedationType || 'N/A'} Average TCI: ${patient.tci || 'N/A'}`, leftMargin, yPos);
                yPos += lineSpacing + 4;
                sedationDoc.setFont('Helvetica', 'normal');
                sedationDoc.setFontSize(9);
                
                const managementText = [
                    patient.sedationType === 'Deep'
                        ? '1. Sedation with Propofol 10mg/ml and Rapifen 20ug/ml. Infusion at 2 - 2.5ug/ml EC with the Schneider model.'
                        : '1. Awake sedation with Propofol 10mg/ml Schneider model effect site 1, Rapifen 20ug/ml Maitre model effect site TCI 60".',
                    '2. Prone position on spinal cushion with attention to pressure points. Eyes moisturised with celluvisc, closed and covered with eyebar/micropore.',
                    '3. Self-ventilation with nasal prongs and CO2 monitoring',
                    '4. Other drugs used:',
                    '    a. Cefzol 1g IVI bolus at the start of procedure',
                    '    b. Ondansetron 4mg',
                    '5. Post-op analgesia: Script by Pain practitioner',
                    '6. Monitor: ECG, NIBP (S/D/M), SaO2, PeCO2',
                    '7. Anaesthetic circuit: Circle system with IPPV available if needed',
                    '8. Ventilation: SV with nasal prongs, 2l/min',
                    '9. Intravenous site: Right hand, 20G, no IVI fluid',
                    '10.Blood loss: None',
                    '11.Intra-operative problems'
                ];

                managementText.forEach(line => {
                    const splitLines = sedationDoc.splitTextToSize(line, pageWidth - leftMargin * 2);
                    sedationDoc.text(splitLines, leftMargin, yPos);
                    yPos += (splitLines.length * (lineSpacing + 1));
                });

                sedationDoc.save(`Sedation ${patient.name}.pdf`);
            });
        } catch (error) {
            console.error("Failed to generate PDFs:", error);
            alert(`Failed to generate PDFs:\n${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsCreatingPdfs(false);
        }
    };

    return (
        <div className="bg-[#004D40] bg-opacity-50 rounded-xl shadow-2xl p-4 sticky top-8">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-[#00796B] pb-2">List Actions</h3>
            <div className="space-y-4">
                <ActionSection title="Quick Data">
                    <div className="flex space-x-2">
                        <ActionButton onClick={() => onOpenQuickImportModal(list.id)}>
                            <ImportIcon /> Import
                        </ActionButton>
                        <ActionButton onClick={handleExportQuickData}>
                            <ExportIcon /> Export
                        </ActionButton>
                    </div>
                </ActionSection>
                <hr className="border-t border-[#00796B] opacity-50"/>
                <ActionSection title="Email">
                     <div className="flex space-x-2">
                        <ActionButton onClick={handleCopyEmailHeader}>
                            <CopyIcon /> {headerCopyText}
                        </ActionButton>
                        <ActionButton onClick={handleCopyEmailBody}>
                            <CopyIcon /> {bodyCopyText}
                        </ActionButton>
                    </div>
                </ActionSection>
                 <hr className="border-t border-[#00796B] opacity-50"/>
                <ActionSection title="Documents">
                    <ActionButton onClick={handleCreatePdfs} disabled={isCreatingPdfs}>
                        {isCreatingPdfs ? <LoadingSpinner/> : <PdfIcon />}
                        {isCreatingPdfs ? 'Creating...' : 'Create PDFs'}
                    </ActionButton>
                </ActionSection>
                 <hr className="border-t border-[#00796B] opacity-50"/>
                 <ActionSection title="Danger Zone">
                    <ActionButton onClick={onDeleteClick} variant="danger">
                        <DeleteIcon /> Delete List
                    </ActionButton>
                </ActionSection>
            </div>
        </div>
    );
};

// From: components/TheaterListView.tsx
interface TheaterListViewProps {
    list: TheaterList;
    doctors: Doctor[];
    onDelete: () => void;
    onUpdatePatient: (listId: number, patientInternalId: string, updatedData: Partial<Patient>) => void;
    onOpenQuickImportModal: (listId: number) => void;
    emailHeaderTemplate: string;
    emailBodyTemplate: string;
    expandCollapseSignal: { version: number; expand: boolean };
}

const TheaterListView: React.FC<TheaterListViewProps> = ({ list, doctors, onDelete, onUpdatePatient, onOpenQuickImportModal, emailHeaderTemplate, emailBodyTemplate, expandCollapseSignal }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const handleToggleCollapse = () => {
        setIsCollapsed(prevState => !prevState);
    };

    return (
        <div className="bg-black bg-opacity-20 p-4 rounded-xl shadow-lg border border-[#004D40]">
            <div className="flex flex-col md:flex-row gap-8">
                <div className={isCollapsed ? 'w-full' : 'md:w-2/3 w-full'}>
                    <PatientTable 
                        info={list.info} 
                        patients={list.patients} 
                        isCollapsed={isCollapsed}
                        onToggleCollapse={handleToggleCollapse}
                        onUpdatePatient={(patientInternalId, data) => onUpdatePatient(list.id, patientInternalId, data)}
                        expandCollapseSignal={expandCollapseSignal}
                    />
                </div>
                {!isCollapsed && (
                    <div className="md:w-1/3 w-full">
                        <ActionPanel 
                            list={list} 
                            doctors={doctors}
                            onDeleteClick={onDelete}
                            onOpenQuickImportModal={onOpenQuickImportModal}
                            emailHeaderTemplate={emailHeaderTemplate}
                            emailBodyTemplate={emailBodyTemplate}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// From: components/DoctorsModal.tsx
interface DoctorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  onSave: (doctors: Doctor[]) => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const DoctorsModal: React.FC<DoctorsModalProps> = ({ isOpen, onClose, doctors, onSave }) => {
  const [editableDoctors, setEditableDoctors] = React.useState<Doctor[]>([]);

  React.useEffect(() => {
    // Deep copy to prevent mutating original state
    if (isOpen) {
      setEditableDoctors(JSON.parse(JSON.stringify(doctors)));
    }
  }, [isOpen, doctors]);

  if (!isOpen) return null;

  const handleAddDoctor = () => {
    setEditableDoctors([...editableDoctors, { id: Date.now(), name: '', practiceNumber: '' }]);
  };

  const handleUpdateDoctor = (index: number, field: 'name' | 'practiceNumber', value: string) => {
    const updatedDoctors = [...editableDoctors];
    updatedDoctors[index] = { ...updatedDoctors[index], [field]: value };
    setEditableDoctors(updatedDoctors);
  };

  const handleRemoveDoctor = (id: number) => {
    setEditableDoctors(editableDoctors.filter(doc => doc.id !== id));
  };

  const handleSaveChanges = () => {
    // Filter out any empty doctor entries before saving
    const validDoctors = editableDoctors.filter(doc => doc.name.trim() !== '');
    onSave(validDoctors);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-[#004D40] rounded-xl shadow-2xl p-8 w-full max-w-2xl mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6 border-b border-[#00796B] pb-3">
          <h2 className="text-2xl font-bold text-white">Manage Doctors</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-3">
            {editableDoctors.map((doctor, index) => (
                <div key={doctor.id} className="flex items-center space-x-3 p-2 rounded-md bg-black bg-opacity-20">
                    <input 
                        type="text" 
                        placeholder="Doctor Name"
                        value={doctor.name}
                        onChange={(e) => handleUpdateDoctor(index, 'name', e.target.value)}
                        className="flex-grow bg-[#003638] border border-[#00796B] text-white rounded-md p-2 focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none"
                    />
                    <input 
                        type="text" 
                        placeholder="Practice Number"
                        value={doctor.practiceNumber}
                        onChange={(e) => handleUpdateDoctor(index, 'practiceNumber', e.target.value)}
                        className="w-1/3 bg-[#003638] border border-[#00796B] text-white rounded-md p-2 focus:ring-2 focus:ring-[#4DB6AC] focus:outline-none"
                    />
                    <button onClick={() => handleRemoveDoctor(doctor.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-800 rounded-full transition-colors">
                        <TrashIcon />
                    </button>
                </div>
            ))}
        </div>

        <div className="mt-6 flex justify-between">
            <button 
                onClick={handleAddDoctor}
                className="flex items-center justify-center bg-[#00796B] hover:bg-[#00695C] text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
                <PlusIcon />
                Add a doctor
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

// From: components/HospitalsModal.tsx
interface HospitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitals: Hospital[];
  onSave: (hospitals: Hospital[]) => void;
}

const HospitalsModal: React.FC<HospitalsModalProps> = ({ isOpen, onClose, hospitals, onSave }) => {
  const [editableHospitals, setEditableHospitals] = React.useState<Hospital[]>([]);

  React.useEffect(() => {
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

// From: components/AiPromptModal.tsx
interface AiPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  onSave: (prompt: string) => void;
}

const AiPromptModal: React.FC<AiPromptModalProps> = ({ isOpen, onClose, prompt, onSave }) => {
  const [editedPrompt, setEditedPrompt] = React.useState(prompt);

  React.useEffect(() => {
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

// From: components/QuickImportModal.tsx
interface QuickImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (patients: Partial<Patient>[]) => void;
}

const QuickImportModal: React.FC<QuickImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [fileName, setFileName] = React.useState<string>('');
  const [file, setFile] = React.useState<File | null>(null);
  const [parsedData, setParsedData] = React.useState<(Partial<Patient> & { isSelected: boolean })[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setFileName('');
    setFile(null);
    setIsLoading(false);
    setError(null);
    setParsedData([]);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
      handleFileParse(selectedFile);
    }
  };

  const handleFileParse = (fileToParse: File) => {
    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const importedData: Partial<Patient>[] = [];
        let patientIndex = 0;
        
        const getCell = (col: number, row: number): any => {
            const cell_ref = XLSX.utils.encode_cell({ c: col, r: row - 1 });
            const cell = worksheet[cell_ref];
            return cell ? (cell.w || cell.v) : undefined;
        };

        while (true) {
            const start_row = 1 + (patientIndex * 12);
            
            const M = 12; const K = 10; const N = 13;
            const name = getCell(M, start_row);

            if (!name) break; // No more patients found

            const notes = [];
            for (let i = 0; i < 7; i++) {
                notes.push(getCell(M, start_row + 1 + i) || '');
            }

            const patientData: Partial<Patient> = {
                name,
                age: String(getCell(N, start_row) || ''),
                notes,
                procedureSummary: getCell(M, start_row + 8),
                inTime: String(getCell(K, start_row + 3) || ''),
                outTime: String(getCell(K, start_row + 4) || ''),
                weight: String(getCell(K, start_row + 5) || ''),
                height: String(getCell(K, start_row + 6) || ''),
                sedationType: getCell(K, start_row + 7) === 'Deep' ? 'Deep' : 'Awake',
                tci: String(getCell(K, start_row + 8) || ''),
                ketamine: String(getCell(N, start_row + 10) || ''),
            };
            
            importedData.push(patientData);
            patientIndex++;
        }
        
        if (importedData.length === 0) {
            throw new Error("No valid patient data found in the specified format.");
        }

        setParsedData(importedData.map(p => ({ ...p, isSelected: true })));
        setIsLoading(false);
      } catch (err) {
        console.error("File parsing error:", err);
        setError(`Failed to parse file. Please ensure it's a valid quick data file. Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
        setFile(null);
        setFileName('');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsLoading(false);
    }
    reader.readAsArrayBuffer(fileToParse);
  };
  
  const handleConfirmImport = () => {
    const selectedData = parsedData.filter(p => p.isSelected).map(({isSelected, ...rest}) => rest);
    onImport(selectedData);
    handleClose();
  };

  const handleTogglePatientSelection = (patientIndex: number) => {
    setParsedData(currentData => 
      currentData.map((p, index) => 
        index === patientIndex ? { ...p, isSelected: !p.isSelected } : p
      )
    );
  };

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setParsedData(currentData => 
      currentData.map(p => ({ ...p, isSelected: checked }))
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-[#004D40] rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Import Quick Data</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        
        {error && <div className="bg-red-500 bg-opacity-50 text-white p-3 rounded-md mb-4">{error}</div>}

        {!file && (
          <div 
            className="border-2 border-dashed border-[#00796B] rounded-lg p-8 text-center cursor-pointer hover:bg-[#003638]"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" accept=".xlsx" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <div className="flex flex-col items-center">
              <FileUploadIcon />
              <p className="mt-2 text-[#B2DFDB]">Click or drag to upload file</p>
            </div>
          </div>
        )}

        {isLoading && <div className="text-center text-white">Parsing file...</div>}

        {parsedData.length > 0 && !isLoading && (
            <div>
                <p className="text-lg text-white mb-2">Data for the following patients will be imported:</p>
                <div className="bg-[#003638] p-3 rounded-md max-h-60 overflow-y-auto mb-6">
                    <div className="flex items-center p-1 mb-2 border-b border-[#00796B]">
                        <input
                            type="checkbox"
                            id="quick-import-select-all"
                            className="h-4 w-4 mr-3 bg-[#003638] border-[#00796B] text-[#26A69A] rounded focus:ring-[#4DB6AC]"
                            checked={parsedData.every(p => p.isSelected) && parsedData.length > 0}
                            onChange={handleToggleSelectAll}
                        />
                        <label htmlFor="quick-import-select-all" className="text-white font-bold">Select All</label>
                    </div>
                    <ul className="space-y-1">
                        {parsedData.map((p, index) => (
                           <li key={p.name} className="text-white flex items-center p-1 rounded hover:bg-black hover:bg-opacity-20 cursor-pointer" onClick={() => handleTogglePatientSelection(index)}>
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 mr-3 bg-[#003638] border-[#00796B] text-[#26A69A] rounded focus:ring-[#4DB6AC] pointer-events-none"
                                    checked={p.isSelected}
                                    readOnly
                                />
                                {p.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-between mt-6">
                    <button onClick={handleClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Cancel</button>
                    <button onClick={handleConfirmImport} className="bg-[#00796B] hover:bg-[#00695C] text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Confirm Import ({parsedData.filter(p => p.isSelected).length} selected)
                    </button>
                </div>
            </div>
        )}

      </div>
       <style>{`
          @keyframes fade-in-up { 0% { opacity: 0; transform: scale(0.9) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

// From: components/EmailTemplateModal.tsx
interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerTemplate: string;
  bodyTemplate: string;
  onSave: (header: string, body: string) => void;
}

const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({ isOpen, onClose, headerTemplate, bodyTemplate, onSave }) => {
  const [editedHeader, setEditedHeader] = React.useState(headerTemplate);
  const [editedBody, setEditedBody] = React.useState(bodyTemplate);

  React.useEffect(() => {
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

// From: components/ConfirmDeleteModal.tsx
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-[#004D40] rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up text-center">
        <WarningIcon />
        <h2 className="text-2xl font-bold text-white mb-2">Are you sure?</h2>
        <p className="text-[#B2DFDB] mb-6">
            You are about to permanently delete this theater list. This action cannot be undone.
        </p>

        <div className="flex justify-center space-x-4">
            <button 
                onClick={onClose} 
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                Cancel
            </button>
            <button 
                onClick={onConfirm} 
                className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
                Delete List
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

// From: App.tsx
const INITIAL_DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr Riaan Combrinck', practiceNumber: 'PP 0825557' },
  { id: 2, name: 'Dr Nadah Karriem', practiceNumber: 'PP0930369' },
  { id: 3, name: 'Dr Elze-Mari Greyling', practiceNumber: 'PP 0486884' },
  { id: 4, name: 'Dr Hans Relling', practiceNumber: 'PP 0010170' },
  { id: 5, name: 'Dr Thomas van Heerden', practiceNumber: 'PP 0630195' },
  { id: 6, name: 'Dr WA Liebenberg', practiceNumber: 'PP 0191728' },
  { id: 7, name: 'Dr I Taljaard', practiceNumber: 'PP 0940895' },
  { id: 8, name: 'Dr Andrew Liebenberg', practiceNumber: 'PP 1165755' },
  { id: 9, name: 'Dr K Gilday', practiceNumber: 'PP 1222791' },
  { id: 10, name: 'Dr L Mkize', practiceNumber: 'PP 0515175' },
  { id: 11, name: 'Dr S Jacobs', practiceNumber: 'PP 1108646' },
];

const INITIAL_HOSPITALS: Hospital[] = [
    { id: 1, name: 'Harbour Bay Advanced Surgical Centre' },
    { id: 2, name: 'Foreshore Cure Day Hospital' },
    { id: 3, name: 'Panorama Advanced Surgical Centre' },
    { id: 4, name: 'Bellville Cure Day Hospital' },
    { id: 5, name: 'Worcester Advanced Surgical Centre' },
    { id: 6, name: 'Fourways Cure Day Theater' },
    { id: 7, name: 'Durbanville Advanced Surgical Centre' },
    { id: 8, name: 'Somerset West Cure Day Hospital' },
    { id: 9, name: 'Medgate Advanced Surgical Centre' },
    { id: 10, name: 'Knysna Advanced Surgical Centre' },
    { id: 11, name: 'Mbombela Cure Day Theater' },
    { id: 12, name: 'Hermanus Day Hospital' },
];

const INITIAL_AI_PROMPT = `I’m going to send a surgical theatre list with patient and procedure details. The data is quite jumbled. I want you to create a table in the chat, by sequentially taking data from the information I send you. First: Create column one with all the patients’ names in the order that they are presented. Keep the "Mr" or "Mrs" or whatever. Second: Create column two with all the telephone numbers in the order that they are presented. Third: Create column three with all the dates of birth in the order that they are presented (format dd/mm/yyyy). Fourth: Create column four with all the emails in the order that they are presented. Fifth: Create column five with all the ID numbers in the order that they are presented. Sixth: Create column six with all the ages in the order that they are presented. Seventh: Create column seven with all the Medical aid names in the order that they are presented. Eighth: Create column eight with all the Medical aid numbers in the order that they are presented. Ninth: Create column nine with all the Dependant numbers in the order that they are presented (put a ' at the front, so excel sees it as text). Tenth: Create column ten with all the Genders in the order that they are presented. Eleventh: Create column eleven with all the Auth numbers in the order that they are presented. Twelfth: Create column twelve with all the ICD 10 codes in the order that they are presented. Thirteenth: Create column thirteen with all the procedure codes in the order that they are presented(these numbers are found under the heading “codes”, but I want only the four digit RPL codes starting with a 2 or 3, I absolutely do not want the five digit codes. Please try to be meticulous, and not add any codes that are not in the source material). also state the amount of each code, for ex "3287 x 10, 2802 x 4, 0661 x 2". Lastly, add column fourteen with the procedure being done. This information has things like “L1 – S1”, or “C3 – C7”. I want you to take the whole thing, and make a short summary. If it says the word “radiofrequency” or “rhizotomy”, simply say “RF”. If it only has the words “blocks”, then say “blocks”. And then, if it says something like “dorsal root ganglion”, say “DRG”, if there is "Axillary and suprascapular", say "AxSS" and the side "LT/RT/BIL", if it says anything "Occipital" (like greater occipital), simply say "GONS", if it says "Genicular", say "Gen" and the side "LT/RT/BIL", if it says "Obturator and femoral", simply put "ObtFem" and the side "LT/RT/BIL". So for example, “L1 -S1;C3-C7 Dorsal medial branch blocks and pulsed radiofrequency neuromodulation (Bilaterally) and Nerve Root block and Dorsal root ganglion stimulation C4 - C6 (RT) and C6 (LT) and Obturator and femoral nerve block (LT)” will become “ L1-S1, C3-C7 RF, C4-C6 DRG RT, C6 DRG LT, ObtFem LT”. If a patient is getting an RF in any part, you can assume that all other parts are also RF, so you dont need to put "blocks" and "RF", you can just put "RF" for those parts. If it’s confusing, simply state the whole string as is.`;
const INITIAL_EMAIL_HEADER = "Dr Riaan Combrinck billing notes for [date] at [hospital]";
const INITIAL_EMAIL_BODY = `Good afternoon Ryan			

			
Here are my notes for billing for the following patients			
			
The procedures were done by [doctor name] at the [hospital name]`;


const App: React.FC = () => {
  const [isImportModalOpen, setIsImportModalOpen] = React.useState<boolean>(false);
  const [isQuickImportModalOpen, setIsQuickImportModalOpen] = React.useState<boolean>(false);
  const [activeListIdForQuickImport, setActiveListIdForQuickImport] = React.useState<number | null>(null);
  const [isDoctorsModalOpen, setIsDoctorsModalOpen] = React.useState<boolean>(false);
  const [isHospitalsModalOpen, setIsHospitalsModalOpen] = React.useState<boolean>(false);
  const [isAiPromptModalOpen, setIsAiPromptModalOpen] = React.useState<boolean>(false);
  const [isEmailTemplateModalOpen, setIsEmailTemplateModalOpen] = React.useState<boolean>(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = React.useState<boolean>(false);
  const [listToDeleteId, setListToDeleteId] = React.useState<number | null>(null);
  const [expandCollapseSignal, setExpandCollapseSignal] = React.useState({ version: 0, expand: false });

  const [theaterLists, setTheaterLists] = React.useState<TheaterList[]>(() => {
    try {
      const savedLists = localStorage.getItem('theaterLists');
      if (savedLists) {
          const lists: TheaterList[] = JSON.parse(savedLists);
          // Migration step to add internalId if it's missing
          return lists.map(list => ({
              ...list,
              patients: list.patients.map((patient, index) => ({
                  ...patient,
                  internalId: (patient as any).internalId || `${list.id}-${patient.idNumber || index}`
              }))
          }));
      }
      return [];
    } catch (error) {
      console.error("Error parsing theater lists from localStorage", error);
      return [];
    }
  });
  
  const [doctors, setDoctors] = React.useState<Doctor[]>(() => {
    try {
      const savedDoctors = localStorage.getItem('doctors');
      return savedDoctors ? JSON.parse(savedDoctors) : INITIAL_DOCTORS;
    } catch (error) {
      console.error("Error parsing doctors from localStorage", error);
      return INITIAL_DOCTORS;
    }
  });

  const [hospitals, setHospitals] = React.useState<Hospital[]>(() => {
    try {
      const savedHospitals = localStorage.getItem('hospitals');
      return savedHospitals ? JSON.parse(savedHospitals) : INITIAL_HOSPITALS;
    } catch (error) {
      console.error("Error parsing hospitals from localStorage", error);
      return INITIAL_HOSPITALS;
    }
  });
  
  const [aiPrompt, setAiPrompt] = React.useState<string>(() => localStorage.getItem('aiPrompt') || INITIAL_AI_PROMPT);
  const [emailHeaderTemplate, setEmailHeaderTemplate] = React.useState<string>(() => localStorage.getItem('emailHeaderTemplate') || INITIAL_EMAIL_HEADER);
  const [emailBodyTemplate, setEmailBodyTemplate] = React.useState<string>(() => localStorage.getItem('emailBodyTemplate') || INITIAL_EMAIL_BODY);

  React.useEffect(() => {
    localStorage.setItem('theaterLists', JSON.stringify(theaterLists));
  }, [theaterLists]);

  React.useEffect(() => {
    localStorage.setItem('doctors', JSON.stringify(doctors));
  }, [doctors]);

  React.useEffect(() => {
    localStorage.setItem('hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  React.useEffect(() => {
    localStorage.setItem('aiPrompt', aiPrompt);
  }, [aiPrompt]);

  React.useEffect(() => {
    localStorage.setItem('emailHeaderTemplate', emailHeaderTemplate);
  }, [emailHeaderTemplate]);

  React.useEffect(() => {
    localStorage.setItem('emailBodyTemplate', emailBodyTemplate);
  }, [emailBodyTemplate]);


  const handleImport = (info: TheaterListInfo, parsedPatients: Patient[]) => {
    if (parsedPatients.length === 0) {
      setIsImportModalOpen(false);
      return;
    }
    const newList: TheaterList = {
      id: Date.now(),
      info,
      patients: parsedPatients,
    };
    setTheaterLists(prevLists => [...prevLists, newList]);
    setIsImportModalOpen(false);
  };
  
  const handleOpenQuickImportModal = (listId: number) => {
    setActiveListIdForQuickImport(listId);
    setIsQuickImportModalOpen(true);
  };

  const handleQuickImport = (quickData: Partial<Patient>[]) => {
    if (activeListIdForQuickImport === null || quickData.length === 0) {
      setIsQuickImportModalOpen(false);
      setActiveListIdForQuickImport(null);
      return;
    };
    
    setTheaterLists(prevLists => 
      prevLists.map(list => {
        if (list.id === activeListIdForQuickImport) {
          const updatedPatients = list.patients.map(p => {
            const dataToImport = quickData.find(d => d.name === p.name);
            if (dataToImport) {
              const { name, ...updates } = dataToImport;
              return { ...p, ...updates };
            }
            return p;
          });
          return { ...list, patients: updatedPatients };
        }
        return list;
      })
    );
    setIsQuickImportModalOpen(false);
    setActiveListIdForQuickImport(null);
  };

  const handleAddDoctor = (doctorName: string) => {
    const newDoctor: Doctor = {
      id: Date.now(),
      name: doctorName,
      practiceNumber: '', // Default to empty practice number
    };
    setDoctors(prevDoctors => [...prevDoctors, newDoctor]);
  };
  
  const handleAddHospital = (hospitalName: string) => {
    const newHospital: Hospital = {
      id: Date.now(),
      name: hospitalName,
    };
    setHospitals(prevHospitals => [...prevHospitals, newHospital]);
  };

  const handleOpenDeleteConfirm = (listId: number) => {
    setListToDeleteId(listId);
    setIsConfirmDeleteModalOpen(true);
  };
  
  const performDelete = () => {
    if (listToDeleteId === null) return;
    setTheaterLists(prevLists => prevLists.filter(list => list.id !== listToDeleteId));
    setIsConfirmDeleteModalOpen(false);
    setListToDeleteId(null);
  };
  
  const handleSaveDoctors = (updatedDoctors: Doctor[]) => {
    setDoctors(updatedDoctors);
    setIsDoctorsModalOpen(false);
  };
  
  const handleSaveHospitals = (updatedHospitals: Hospital[]) => {
    setHospitals(updatedHospitals);
    setIsHospitalsModalOpen(false);
  };

  const handleSaveAiPrompt = (newPrompt: string) => {
    setAiPrompt(newPrompt);
    setIsAiPromptModalOpen(false);
  };

  const handleSaveEmailTemplate = (header: string, body: string) => {
    setEmailHeaderTemplate(header);
    setEmailBodyTemplate(body);
    setIsEmailTemplateModalOpen(false);
  };

  const handleUpdatePatient = (listId: number, patientInternalId: string, updatedPatientData: Partial<Patient>) => {
    setTheaterLists(prevLists => 
      prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            patients: list.patients.map(patient => 
              patient.internalId === patientInternalId
                ? { ...patient, ...updatedPatientData }
                : patient
            )
          };
        }
        return list;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#003638] text-[#E0F2F1] font-sans antialiased">
      <Header 
        onImportClick={() => setIsImportModalOpen(true)}
        onDoctorsClick={() => setIsDoctorsModalOpen(true)}
        onHospitalsClick={() => setIsHospitalsModalOpen(true)}
        onEditAiPromptClick={() => setIsAiPromptModalOpen(true)}
        onEditEmailTemplateClick={() => setIsEmailTemplateModalOpen(true)}
        aiPrompt={aiPrompt}
      />
      <main className="container mx-auto p-4 md:p-8">
        {theaterLists.length > 0 ? (
          <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setExpandCollapseSignal(prev => ({ version: prev.version + 1, expand: !prev.expand }))}
                    className="bg-[#26A69A] hover:bg-[#00897B] text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    {expandCollapseSignal.expand ? 'Collapse All Patients' : 'Expand All Patients'}
                </button>
            </div>
            <div className="space-y-8">
              {theaterLists.map(list => (
                <TheaterListView 
                  key={list.id} 
                  list={list} 
                  doctors={doctors}
                  onDelete={() => handleOpenDeleteConfirm(list.id)} 
                  onUpdatePatient={handleUpdatePatient}
                  onOpenQuickImportModal={handleOpenQuickImportModal}
                  emailHeaderTemplate={emailHeaderTemplate}
                  emailBodyTemplate={emailBodyTemplate}
                  expandCollapseSignal={expandCollapseSignal}
                />
              ))}
            </div>
          </>
        ) : (
          <WelcomeScreen onImportClick={() => setIsImportModalOpen(true)} />
        )}
      </main>
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        doctors={doctors}
        onAddDoctor={handleAddDoctor}
        hospitals={hospitals}
        onAddHospital={handleAddHospital}
      />
      <QuickImportModal
        isOpen={isQuickImportModalOpen}
        onClose={() => setIsQuickImportModalOpen(false)}
        onImport={handleQuickImport}
      />
      <DoctorsModal
        isOpen={isDoctorsModalOpen}
        onClose={() => setIsDoctorsModalOpen(false)}
        doctors={doctors}
        onSave={handleSaveDoctors}
      />
      <HospitalsModal
        isOpen={isHospitalsModalOpen}
        onClose={() => setIsHospitalsModalOpen(false)}
        hospitals={hospitals}
        onSave={handleSaveHospitals}
      />
      <AiPromptModal
        isOpen={isAiPromptModalOpen}
        onClose={() => setIsAiPromptModalOpen(false)}
        prompt={aiPrompt}
        onSave={handleSaveAiPrompt}
      />
      <EmailTemplateModal
        isOpen={isEmailTemplateModalOpen}
        onClose={() => setIsEmailTemplateModalOpen(false)}
        headerTemplate={emailHeaderTemplate}
        bodyTemplate={emailBodyTemplate}
        onSave={handleSaveEmailTemplate}
      />
       <ConfirmDeleteModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={performDelete}
      />
    </div>
  );
};


// Original index.tsx entry point
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);