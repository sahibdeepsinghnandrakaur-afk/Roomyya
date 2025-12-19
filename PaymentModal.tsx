
import React, { useState } from 'react';
import { Room } from '../types';

interface PaymentModalProps {
  room: Room;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ room, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-800">Checkout Seguro</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-8">
              <div className="flex gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <img src={room.image} className="w-20 h-20 rounded-xl object-cover shadow-sm" alt="" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{room.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{room.location}</p>
                  <p className="text-indigo-600 font-black text-sm mt-2">${room.price}/mes</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Primer mes de alquiler</span>
                  <span className="text-slate-900 font-bold">${room.price},00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Gastos de gestión (SafePay)</span>
                  <span className="text-slate-900 font-bold">$15,00</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-slate-900 font-black">Total a pagar</span>
                  <span className="text-2xl font-black text-indigo-600">${room.price + 15},00</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tarjeta de crédito / débito</label>
                <div className="relative">
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  <div className="absolute right-4 top-4 flex gap-1 opacity-50">
                    <div className="w-6 h-4 bg-slate-400 rounded-sm"></div>
                    <div className="w-6 h-4 bg-slate-400 rounded-sm"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                  <input type="text" placeholder="CVC" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20" />
                </div>
              </div>

              <button 
                onClick={handlePay}
                disabled={loading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Pagar ${room.price + 15},00
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-10">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-2">¡Reserva Completada!</h3>
               <p className="text-slate-500 mb-8 font-medium">Hemos retenido el pago de forma segura. El propietario ha sido notificado.</p>
               <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all">
                 Volver al inicio
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
