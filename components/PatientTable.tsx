import * as React from 'react';
import type { Patient, TheaterListInfo } from '../types.ts';
import { PatientRow } from './PatientRow.tsx';

interface PatientTableProps {
  info: TheaterListInfo;
  patients: Patient[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onUpdatePatient: (patientIdNumber: string, updatedData: Partial<Patient>) => void;
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


export const PatientTable: React.FC<PatientTableProps> = ({ info, patients, isCollapsed, onToggleCollapse, onUpdatePatient }) => {
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
              key={patient.idNumber || index}
              patient={patient}
              index={index}
              onUpdate={(data) => onUpdatePatient(patient.idNumber, data)}
            />
          ))}
        </div>
      )}
    </div>
  );
};