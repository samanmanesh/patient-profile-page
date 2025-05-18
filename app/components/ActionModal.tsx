import React from 'react'
import { Patient } from '../types/patient';

type ActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  data: Patient | null;
};
const ActionModal = ({ isOpen, onClose, action, data }: ActionModalProps) => {
  return (
    <div className='w-1/3 h-full bg-[#EBEBE8] rounded-lg p-4 transition-all duration-300'>
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-medium'>{action}</h1>
            </div>
        </div>
    </div>
  )
}

export default ActionModal