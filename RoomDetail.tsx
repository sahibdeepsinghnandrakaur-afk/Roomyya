
import React, { useState, useRef, useEffect } from 'react';
import { Room, ChatMessage, Review } from '../types';
import { assistant } from '../services/geminiService';
import { PaymentModal } from './PaymentModal';

interface RoomDetailProps {
  room: Room;
  onClose: () => void;
  onAddReview: (roomId: string, review: Review) => void;
}

export const RoomDetail: React.FC<RoomDetailProps> = ({ room, onClose, onAddReview }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', userName: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([{
        role: 'model',
        text: `¡Hola! Soy ${room.ownerName}, el propietario. ¿Qué te parece el cuarto? Si tienes dudas sobre los gastos o las normas, pregúntame lo que quieras.`,
        timestamp: new Date()
      }]);
    }
  }, [isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const reply = await assistant.sendHostMessage(input, messages, room);
    setMessages(prev => [...prev, { role: 'model', text: reply, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment || !newReview.userName) return;

    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('es-ES')
    };

    onAddReview(room.id, review);
    setNewReview({ rating: 5, comment: '', userName: '' });
  };

  const avgRating = room.reviews.length > 0 
    ? (room.reviews.reduce((acc, r) => acc + r.rating, 0) / room.reviews.length).toFixed(1)
    : "Nuevo";

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-300">
      {/* HEADER DE NAVEGACIÓN SECUNDARIO */}
      <div className="max-w-screen-xl mx-auto px-6 py-8 border-b border-slate-100 flex justify-between items-center">
        <div>
          <button onClick={onClose} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-all mb-4">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la búsqueda
          </button>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">{room.title}</h1>
          <p className="flex items-center gap-2 text-slate-500 font-medium mt-2">
             <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
             {room.location}
          </p>
        </div>
        <div className="flex gap-4">
           <button className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
           </button>
           <button className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9.316a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
           </button>
        </div>
      </div>

      {/* GALERÍA WEB */}
      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-4 gap-4 h-[400px] md:h-[550px]">
        <div className="col-span-4 md:col-span-3 rounded-3xl overflow-hidden shadow-sm relative group">
          <img src={room.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={room.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
        <div className="hidden md:flex flex-col gap-4">
          <div className="flex-1 rounded-3xl overflow-hidden shadow-sm hover:brightness-90 transition-all cursor-pointer">
             <img src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex-1 rounded-3xl overflow-hidden bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-600 hover:bg-indigo-100 transition-all cursor-pointer">
             <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             <span className="text-xs font-black uppercase tracking-widest">Ver 12 fotos</span>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL + BARRA LATERAL (FORMATO WEB PORTAL) */}
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 pb-32">
        <div className="lg:col-span-2 space-y-16">
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Sobre el alojamiento</h2>
            <p className="text-slate-500 leading-relaxed text-lg font-medium">{room.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-8">Servicios incluidos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
               {room.amenities.map(item => (
                 <div key={item} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="font-bold text-slate-600 text-sm">{item}</span>
                 </div>
               ))}
            </div>
          </section>

          <section className="pt-16 border-t border-slate-100">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-900">Reseñas ({room.reviews.length})</h2>
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100 text-yellow-700 font-black">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                 {avgRating}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {room.reviews.map(review => (
                <div key={review.id} className="p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                       <p className="font-black text-slate-900">{review.userName}</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{review.date}</p>
                    </div>
                    <div className="flex gap-0.5 text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                    </div>
                  </div>
                  <p className="text-slate-500 italic text-sm leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
            </div>

            <form onSubmit={submitReview} className="p-10 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 space-y-6">
              <h3 className="text-xl font-black text-indigo-950">Envía tu valoración</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-indigo-900/50 uppercase tracking-widest mb-1">Tu nombre</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-white border border-indigo-100 outline-none focus:ring-4 focus:ring-indigo-500/10" value={newReview.userName} onChange={e => setNewReview({ ...newReview, userName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-indigo-900/50 uppercase tracking-widest mb-1">Puntuación</label>
                  <select className="w-full px-5 py-3 rounded-2xl bg-white border border-indigo-100 outline-none" value={newReview.rating} onChange={e => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}>
                    <option value="5">Excelente (5★)</option>
                    <option value="4">Muy buena (4★)</option>
                    <option value="3">Normal (3★)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-indigo-900/50 uppercase tracking-widest mb-1">Tu comentario</label>
                <textarea required rows={4} className="w-full px-5 py-3 rounded-2xl bg-white border border-indigo-100 outline-none resize-none" value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })} />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all">Publicar reseña</button>
            </form>
          </section>
        </div>

        {/* BARRA LATERAL DE RESERVA FIJA */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10">
              <div className="flex justify-between items-baseline mb-10">
                <div>
                  <span className="text-5xl font-black text-slate-900">${room.price}</span>
                  <span className="text-slate-400 font-black ml-1 uppercase text-xs tracking-widest">/ mes</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <button 
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all transform active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Reservar ahora
                </button>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => setIsChatOpen(true)} className="py-4 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-2xl font-black text-sm border border-transparent hover:border-indigo-100 transition-all">Chat</button>
                   <a href={`tel:+34${room.phone.replace(/\s+/g, '')}`} className="py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black text-sm text-center transition-all flex items-center justify-center">Llamar</a>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 flex items-center gap-5">
                 <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-300 text-2xl border-2 border-slate-50">{room.ownerName.charAt(0)}</div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gestionado por</p>
                    <p className="text-lg font-black text-slate-900">{room.ownerName}</p>
                 </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 flex gap-4">
               <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </div>
               <div>
                  <h4 className="font-black text-emerald-950 text-sm">Protección SafePay</h4>
                  <p className="text-emerald-700/60 text-xs font-medium mt-1 leading-relaxed">No pagamos al casero hasta que nos confirmes que todo está en orden al entrar.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT CON EL CASERO MODAL */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-xl h-[650px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
              <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-xl">{room.ownerName.charAt(0)}</div>
                  <div>
                    <h3 className="font-black text-lg">{room.ownerName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-200">
                       <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                       Online ahora
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-5 rounded-3xl text-sm font-medium shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-slate-100 flex gap-1.5">
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                      <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-8 bg-white border-t border-slate-50 flex gap-4">
                <input type="text" placeholder="Pregúntale a Carlos..." className="flex-1 bg-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" value={input} onChange={(e) => setInput(e.target.value)} />
                <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform active:scale-95">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
           </div>
        </div>
      )}

      {isPaymentOpen && <PaymentModal room={room} onClose={() => setIsPaymentOpen(false)} />}
    </div>
  );
};
