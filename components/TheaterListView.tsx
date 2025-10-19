import React, { useState } from 'react';
import { ActionPanel } from './ActionPanel.tsx';
import { PatientTable } from './PatientTable.tsx';
import type { Patient, TheaterList, Doctor } from '../types.ts';

interface TheaterListViewProps {
    list: TheaterList;
    doctors: Doctor[];
    onDelete: () => void;
    onUpdatePatient: (listId: number, patientIdNumber: string, updatedData: Partial<Patient>) => void;
    onOpenQuickImportModal: (listId: number) => void;
    emailHeaderTemplate: string;
    emailBodyTemplate: string;
}

export const TheaterListView: React.FC<TheaterListViewProps> = ({ list, doctors, onDelete, onUpdatePatient, onOpenQuickImportModal, emailHeaderTemplate, emailBodyTemplate }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

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
                        onUpdatePatient={(patientIdNumber, data) => onUpdatePatient(list.id, patientIdNumber, data)}
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