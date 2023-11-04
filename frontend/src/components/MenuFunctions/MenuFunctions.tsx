import React from 'react';
import './MenuFunctions.css';
import StoresPage from './StoresPage';

interface MenuProps {
    onClose: () => void;
}

const MenuFunctions: React.FC<MenuProps> = ({ onClose }) => {
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
            <div className="modal-content">
                <StoresPage/>
                <h2>Modal Window</h2>
                <p>This is the content inside the modal window.</p>         
                <button onClick={onClose}>Close</button>
                
            </div>
        </div>
    );
}

export default MenuFunctions;
