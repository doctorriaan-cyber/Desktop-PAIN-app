import * as React from 'react';
import type { TheaterList, Doctor, Patient } from '../types.ts';

interface ActionPanelProps {
    list: TheaterList;
    doctors: Doctor[];
    onDeleteClick: () => void;
    onOpenQuickImportModal: (listId: number) => void;
    emailHeaderTemplate: string;
    emailBodyTemplate: string;
}

declare const XLSX: any;
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

export const ActionPanel: React.FC<ActionPanelProps> = ({ list, doctors, onDeleteClick, onOpenQuickImportModal, emailHeaderTemplate, emailBodyTemplate }) => {
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
                    { label: 'Date', value: new Date(list.info.date + 'T00:00:00').toLocaleDateString('en-GB') },
                    { label: 'Hospital Name', value: list.info.hospitalLocation },
                    { label: 'Surgeon', value: surgeonText },
                    { label: 'ICD 10 Codes', value: String(patient.icd10Codes || 'N/A') },
                    { label: 'Procedure Codes', value: procedureCodesValue },
                    { label: 'Time', value: `In: ${patient.inTime || 'N/A'}  Out: ${patient.outTime || 'N/A'}`},
                    { label: 'BMI', value: `W: ${patient.weight || 'N/A'}kg  H: ${patient.height || 'N/A'}m  BMI: ${bmi}`},
                    { label: 'Procedure Codes', value: staticCodes.join(', ')}
                ];

                tableData.forEach((row, index) => {
                    billingDoc.rect(tableX, tableY, tableWidth, rowHeight);
                    billingDoc.line(tableX + col1Width, tableY, tableX + col1Width, tableY + rowHeight);
                    billingDoc.setFont('Helvetica', 'bold');
                    if (index === 7 && row.label === 'Procedure Codes') billingDoc.setTextColor(0, 0, 255); else billingDoc.setTextColor(0, 0, 0);
                    billingDoc.text(row.label, tableX + 5, tableY + textOffsetY);
                    billingDoc.setTextColor(0, 0, 0); 
                    billingDoc.setFont('Helvetica', 'normal');
                    const valueText = billingDoc.splitTextToSize(row.value, col2Width - 10);
                    billingDoc.text(valueText, tableX + col1Width + 5, tableY + textOffsetY - (valueText.length > 1 ? 5 : 0));
                    tableY += rowHeight;
                });
                billingDoc.save(`Billing ${patient.name}.pdf`);
            });
            
            // Pause for 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Phase 2: Create all Sedation Records
            list.patients.forEach(patient => {
                const sedationDoc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
                sedationDoc.setFont('Helvetica', 'normal');
                sedationDoc.setTextColor(0, 0, 0);
                const pageWidth = sedationDoc.internal.pageSize.getWidth();
                sedationDoc.setFont('Helvetica', 'bold');
                sedationDoc.setFontSize(22);
                sedationDoc.text('Sedation Record', pageWidth / 2, 40, { align: 'center' });
                const sedHeaderEndY = drawDoctorHeader(sedationDoc, 80);
                const sedStickerEndY = drawPatientSticker(sedationDoc, patient, 80);

                let yPos = Math.max(sedHeaderEndY, sedStickerEndY) + 20;
                
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