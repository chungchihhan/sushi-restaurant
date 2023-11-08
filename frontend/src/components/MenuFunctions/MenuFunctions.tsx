import React, { useState } from 'react';
import './MenuFunctions.css';
import StoresPage from './StoresPage';
import UserInfoDialog from '../UserInfo/UserInfo';
import OrderRecordDialog from '../OrderRecord/OrderRecord';

interface MenuProps {
    onClose: () => void;
}

const MenuFunctions: React.FC<MenuProps> = ({ onClose }) => {
    const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
    const [isOrderRecordOpen, setIsOrderRecordOpen] = useState(false);

    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleUserInfoButton = () => {
        setIsUserInfoOpen(true);
    };

    const handleOrderRecordButton = () => {
        setIsOrderRecordOpen(true);
    };

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
            <div className="modal-content">
                <StoresPage/>
                <h2>Modal Window</h2>
                <p>This is the content inside the modal window.</p>         
                <button onClick={onClose}>Close</button>
                <div>
                    <button onClick={handleUserInfoButton}>
                        User Info
                    </button>
                    {isUserInfoOpen && <UserInfoDialog onClose={() => setIsUserInfoOpen(false)} />}
                </div>
                <div>
                    <button onClick={handleOrderRecordButton}>
                        Order Record
                    </button>
                    {isOrderRecordOpen && <OrderRecordDialog onClose={() => setIsOrderRecordOpen(false)} />}
                </div>
            </div>
        </div>
    );
}

export default MenuFunctions;
