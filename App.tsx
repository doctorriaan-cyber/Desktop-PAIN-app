import * as React from 'react';
import { ImportModal } from './components/ImportModal.tsx';
import type { Patient, TheaterListInfo, TheaterList, Doctor, Hospital } from './types.ts';
import { Header } from './components/Header.tsx';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import { TheaterListView } from './components/TheaterListView.tsx';
import { DoctorsModal } from './components/DoctorsModal.tsx';
import { HospitalsModal } from './components/HospitalsModal.tsx';
import { AiPromptModal } from './components/AiPromptModal.tsx';
import { QuickImportModal } from './components/QuickImportModal.tsx';
import { EmailTemplateModal } from './components/EmailTemplateModal.tsx';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal.tsx';

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

  const [theaterLists, setTheaterLists] = React.useState<TheaterList[]>(() => {
    try {
      const savedLists = localStorage.getItem('theaterLists');
      return savedLists ? JSON.parse(savedLists) : [];
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
    if (activeListIdForQuickImport === null) return;
    
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

  const handleUpdatePatient = (listId: number, patientIdNumber: string, updatedPatientData: Partial<Patient>) => {
    setTheaterLists(prevLists => 
      prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            patients: list.patients.map(patient => 
              patient.idNumber === patientIdNumber 
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
              />
            ))}
          </div>
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

export default App;