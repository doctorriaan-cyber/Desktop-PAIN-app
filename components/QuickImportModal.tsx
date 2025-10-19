import React, { useState, useRef } from 'react';
import type { Patient } from '../types';

interface QuickImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (patients: Partial<Patient>[]) => void;
}

declare const XLSX: any; // From CDN script

const FileUploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4DB6AC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 mr-2 text-green-300" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const QuickImportModal: React.FC<QuickImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [fileName, setFileName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Partial<Patient>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            // .w is the formatted text. Use it for values that might be dates/times.
            // .v is the raw value. Prioritize .w if it exists.
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

        setParsedData(importedData);
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
    onImport(parsedData);
    handleClose();
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
                    <ul className="space-y-1">
                        {parsedData.map(p => (
                            <li key={p.name} className="text-white flex items-center">
                                <CheckCircleIcon /> {p.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-between mt-6">
                    <button onClick={handleClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Cancel</button>
                    <button onClick={handleConfirmImport} className="bg-[#00796B] hover:bg-[#00695C] text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Confirm Import
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