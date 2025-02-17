'use client';

import React, { useCallback, useState } from 'react';
import { FaBars } from 'react-icons/fa6';
import MenuContainer from './menu-container';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <div className="lg:hidden">
            <FaBars size={24} color="#FBF1EA" onClick={toggleMenu} />
            {isOpen && <MenuContainer onClose={handleClose} />}
        </div>
    );
};

export default Menu;
