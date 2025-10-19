import * as React from 'react';
import type { Patient } from '../types.ts';

interface PatientRowProps {
  patient: Patient;
  index: number;
  onUpdate: (updatedData: Partial<Patient>) => void;
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


export const PatientRow: React.FC<PatientRowProps> = ({ patient, index, onUpdate }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    
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
                className="flex flex-wrap items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center flex-shrink-0 mr-4">
                    <div className="flex-shrink-0 w-8 h-8 mr-3 bg-[#00796B] rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                    </div>
                    <p className="text-lg font-bold text-white">{patient.name}</p>
                </div>
                
                <div className="flex-grow flex items-center flex-wrap md:flex-nowrap gap-x-6">
                    {/* Stats Group */}
                    <div className="flex items-center flex-wrap flex-shrink-0 [&>div]:!flex-initial [&>div]:!min-w-0">
                        <DataItem label="Age" value={patient.age} />
                        <DataItem label="Gender" value={patient.gender} />
                        <DataItem label="Weight (kg)" value={patient.weight} />
                        <DataItem label="Height (m)" value={patient.height} />
                        <DataItem label="BMI" value={calculateBmi()} />
                    </div>
                    {/* Procedure takes remaining space */}
                    <DataItem label="Procedure" value={patient.procedureSummary} />
                </div>

                <div className="ml-4">
                     <PatientChevronIcon isExpanded={isExpanded} />
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
                                <div className="flex items-center space-x-8 mb-4">
                                    <FormCheckbox label="Caution" name="caution" checked={patient.caution || false} onChange={handleChange} />
                                    <FormCheckbox label="Penicillin Allergy" name="penicillinAllergy" checked={patient.penicillinAllergy || false} onChange={handleChange} />
                                    <FormCheckbox label="Previously Done" name="previouslyDone" checked={patient.previouslyDone || false} onChange={handleChange} />
                                </div>
                                <div className="mb-4">
                                    <FormInput 
                                        label="Procedure" 
                                        name="procedureSummary" 
                                        value={patient.procedureSummary || ''} 
                                        onChange={handleChange}
                                    />
                                </div>
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
            )}
        </div>
    );
};