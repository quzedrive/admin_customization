'use client'

import React,{createContext,useContext,useState} from 'react'

type WhatsappContext ={
    isOpen : boolean;
    open : ()=> void;
    close : ()=> void;
    toggle : ()=> void;
}
const WhatsAppContext = createContext<WhatsappContext>(null);

export function WhatsAppProvider({children}:{children:React.ReactNode}){
    const [isOpen,setIsOpen] = useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <WhatsAppContext.Provider value={{isOpen ,open ,close,toggle}}>
            {children}
        </WhatsAppContext.Provider>
    )
}

export const useWhatsApp = () => {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) throw new Error('useWhatsApp must be used within WhatsAppProvider');
  return ctx;
};