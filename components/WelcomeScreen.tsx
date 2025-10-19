
import React from 'react';

interface WelcomeScreenProps {
    onImportClick: () => void;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#4DB6AC] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-3-3m0 0l3-3m-3 3h12" />
    </svg>
);


export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onImportClick }) => {
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
