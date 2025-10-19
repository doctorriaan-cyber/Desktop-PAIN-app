import React, { useState } from 'react';

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


export const Header: React.FC<HeaderProps> = ({ onImportClick, onDoctorsClick, onHospitalsClick, onEditAiPromptClick, onEditEmailTemplateClick, aiPrompt }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy AI Prompt');
    
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