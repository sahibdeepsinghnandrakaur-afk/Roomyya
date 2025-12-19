
import React, { useState, useEffect } from 'react';
import { Room, Review, PlatformReview } from './types';
import { RoomCard } from './components/RoomCard';
import { RoomForm } from './components/RoomForm';
import { RoomDetail } from './components/RoomDetail';
import { ChatWidget } from './components/ChatWidget';
import { LoginModal } from './components/LoginModal';

const INITIAL_ROOMS: Room[] = [
  {
    id: '1',
    title: 'Estudio moderno en el corazón de Madrid',
    description: 'Habitación espaciosa y recién reformada con cama doble de alta gama, escritorio ergonómico para teletrabajo y balcón privado con vistas a la calle principal. Perfecta para estancias de media y larga duración.',
    price: 450,
    location: 'Madrid, Centro-Sol',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200',
    amenities: ['Wifi 600Mb', 'Balcón', 'Escritorio', 'Cama Doble', 'Limpieza semanal'],
    ownerName: 'Carlos Ruiz',
    phone: '612 345 678',
    reviews: [
      { id: 'r1', userName: 'Lucía M.', rating: 5, comment: 'Increíble estancia, Carlos es muy atento y el sistema de pago es genial.', date: '2024-03-15' }
    ]
  },
  {
    id: '2',
    title: 'Suite minimalista en Gràcia con baño propio',
    description: 'Ambiente extremadamente silencioso y acogedor, perfecto para profesionales que buscan tranquilidad. Incluye baño privado recién reformado.',
    price: 520,
    location: 'Barcelona, Barrio de Gràcia',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    amenities: ['Wifi', 'Gastos incluidos', 'Aire acondicionado', 'Baño privado'],
    ownerName: 'Elena Martínez',
    phone: '623 456 789',
    reviews: []
  },
  {
    id: '3',
    title: 'Habitación luminosa junto al Parque del Turia',
    description: 'Habitación muy luminosa en piso compartido con gente joven. Zona inmejorable.',
    price: 310,
    location: 'Valencia, Ruzafa',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200',
    amenities: ['Vistas al parque', 'Ascensor', 'Cocina equipada'],
    ownerName: 'Ricardo Sanz',
    phone: '634 567 890',
    reviews: []
  }
];

const INITIAL_PLATFORM_REVIEWS: PlatformReview[] = [
  {
    id: 'p1',
    userName: 'Marta Jiménez',
    userRole: 'Inquilina',
    rating: 5,
    comment: 'Encontré mi habitación ideal y pagué el primer mes con total seguridad. ¡Súper recomendado!',
    avatar: 'https://i.pravatar.cc/150?u=marta'
  }
];

const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [platformReviews, setPlatformReviews] = useState<PlatformReview[]>(INITIAL_PLATFORM_REVIEWS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPlatformReviewOpen, setIsPlatformReviewOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<{name: string} | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newPReview, setNewPReview] = useState({ userName: '', userRole: 'Inquilino', rating: 5, comment: '' });

  const handleAddRoom = (newRoom: Room) => {
    setRooms(prev => [newRoom, ...prev]);
  };

  const handleAddRoomReview = (roomId: string, review: Review) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, reviews: [review, ...room.reviews] } : room
    ));
    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom(prev => prev ? { ...prev, reviews: [review, ...prev.reviews] } : null);
    }
  };

  const handleAddPlatformReview = (e: React.FormEvent) => {
    e.preventDefault();
    const review: PlatformReview = {
      id: Date.now().toString(),
      userName: newPReview.userName,
      userRole: newPReview.userRole,
      rating: newPReview.rating,
      comment: newPReview.comment,
      avatar: `https://i.pravatar.cc/150?u=${newPReview.userName}`
    };
    setPlatformReviews(prev => [review, ...prev]);
    setIsPlatformReviewOpen(false);
    setNewPReview({ userName: '', userRole: 'Inquilino', rating: 5, comment: '' });
  };

  useEffect(() => {
    if (selectedRoom) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedRoom]);

  const filteredRooms = rooms.filter(room => 
    room.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* NAVEGACIÓN WEB SUPERIOR */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedRoom(null)}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">roomy<span className="text-indigo-600">.es</span></span>
            </div>

            {/* BUSCADOR INTEGRADO EN NAV */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
              <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Busca por ciudad, barrio o título..." 
                className="bg-transparent text-sm font-medium w-full outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {!user ? (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="text-sm font-bold text-slate-600 hover:text-indigo-600 px-4 py-2 transition-colors"
              >
                Mi cuenta
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold uppercase">{user.name.charAt(0)}</div>
                <span className="text-sm font-bold text-indigo-700">{user.name}</span>
              </div>
            )}
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-md transition-all text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Publicar anuncio
            </button>
          </div>
        </div>
      </nav>

      {!selectedRoom ? (
        <>
          {/* HERO WEB SECTION */}
          <header className="bg-white border-b border-slate-100">
            <div className="max-w-screen-2xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center md:text-left">
                <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-black rounded-full mb-6 tracking-widest uppercase">
                  Portal de Alquiler Seguro
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                  La forma más <span className="text-indigo-600">segura</span> de alquilar tu próxima habitación.
                </h1>
                <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                  Roomy es la plataforma líder para estudiantes y profesionales. Pagos retenidos de forma segura hasta que entres a vivir.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                   <span className="flex items-center gap-2"><svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg> Identidad verificada</span>
                   <span className="flex items-center gap-2"><svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg> Pagos SafePay</span>
                </div>
              </div>
              <div className="relative hidden lg:block">
                 <div className="bg-white p-4 rounded-[2rem] shadow-2xl rotate-2 relative z-10">
                    <img src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=600" className="rounded-[1.5rem] w-[450px]" alt="Habitación" />
                 </div>
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </header>

          <main className="max-w-screen-2xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* FILTROS WEB LATERALES */}
              <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Filtrar resultados</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Precio máximo</label>
                      <input type="range" min="100" max="1000" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                        <span>100€</span>
                        <span>1000€</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de inquilino</label>
                      <div className="space-y-2">
                        {['Estudiantes', 'Trabajadores', 'Cualquiera'].map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Servicios</label>
                      <div className="space-y-2">
                        {['Wifi', 'Baño privado', 'Aire acondicionado', 'Ascensor'].map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-lg">
                  <h4 className="font-bold mb-2">¿Eres propietario?</h4>
                  <p className="text-xs text-indigo-100 mb-4 leading-relaxed">Publica gratis y recibe solicitudes de inquilinos verificados hoy mismo.</p>
                  <button onClick={() => setIsFormOpen(true)} className="w-full py-2 bg-white text-indigo-600 rounded-lg font-bold text-xs hover:bg-indigo-50 transition-colors">Empezar a anunciar</button>
                </div>
              </aside>

              {/* GRILLA DE RESULTADOS */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-slate-900">{filteredRooms.length} habitaciones encontradas</h2>
                  <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option>Más recientes</option>
                    <option>Precio: de menor a mayor</option>
                    <option>Precio: de mayor a menor</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredRooms.map((room) => (
                    <RoomCard key={room.id} room={room} onViewDetail={(r) => setSelectedRoom(r)} />
                  ))}
                  {filteredRooms.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                       <p className="text-slate-400 font-bold">No se han encontrado resultados que coincidan con tu búsqueda.</p>
                       <button onClick={() => setSearchTerm('')} className="mt-4 text-indigo-600 underline font-bold">Limpiar búsqueda</button>
                    </div>
                  )}
                </div>

                {/* TESTIMONIOS WEB */}
                <section className="mt-24 pt-20 border-t border-slate-200">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">Opiniones de la comunidad</h2>
                      <p className="text-slate-500 mt-2 font-medium">Usuarios reales que encontraron su hogar con Roomy.</p>
                    </div>
                    <button onClick={() => setIsPlatformReviewOpen(true)} className="bg-white border border-slate-200 px-6 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                      Añadir mi opinión
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {platformReviews.map((review) => (
                      <div key={review.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex gap-0.5 text-yellow-400 mb-4">
                          {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                        </div>
                        <p className="text-slate-600 italic mb-6 leading-relaxed">"{review.comment}"</p>
                        <div className="flex items-center gap-4">
                          <img src={review.avatar} className="w-10 h-10 rounded-full bg-slate-100" alt="" />
                          <div>
                            <p className="text-sm font-black text-slate-900">{review.userName}</p>
                            <p className="text-[10px] font-black text-indigo-600 uppercase">{review.userRole}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </main>
        </>
      ) : (
        <RoomDetail room={selectedRoom} onClose={() => setSelectedRoom(null)} onAddReview={handleAddRoomReview} />
      )}

      {/* FOOTER WEB CLÁSICO */}
      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-black tracking-tighter mb-6 block">roomy<span className="text-indigo-500">.es</span></span>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">Encuentra tu próximo hogar entre miles de habitaciones verificadas. Pagos seguros y chat con propietarios.</p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
              </div>
            </div>
            <div>
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Plataforma</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-400">
                 <li className="hover:text-indigo-400 cursor-pointer transition-colors">Buscar habitaciones</li>
                 <li className="hover:text-indigo-400 cursor-pointer transition-colors">Cómo funciona</li>
                 <li className="hover:text-indigo-400 cursor-pointer transition-colors">Anunciar ahora</li>
               </ul>
            </div>
            <div>
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Compañía</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-400">
                 <li className="hover:text-indigo-400 cursor-pointer transition-colors">Sobre nosotros</li>
                 <li className="hover:text-indigo-400 cursor-pointer transition-colors">Blog</li>
                 <li className="hover:text-indigo-400 cursor-pointer transition-colors">Contacto</li>
               </ul>
            </div>
            <div>
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Legal</h4>
               <ul className="space-y-4 text-sm font-bold text-slate-400">
                 <li className="hover:text-indigo-400 cursor-pointer transition-colors">Términos y condiciones</li>
                 <li className="hover:text-indigo-400 cursor-pointer transition-colors">Privacidad</li>
                 <li className="hover:text-indigo-400 cursor-pointer transition-colors">Política de cookies</li>
               </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© 2024 Roomy Real Estate S.L. Todos los derechos reservados.</p>
            <div className="flex items-center gap-8">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4 opacity-30 grayscale" alt="Stripe" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 opacity-30 grayscale" alt="Visa" />
            </div>
          </div>
        </div>
      </footer>

      {/* MODALES & AYUDA */}
      {isFormOpen && <RoomForm onAddRoom={handleAddRoom} onClose={() => setIsFormOpen(false)} />}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} onLogin={(name) => { setUser({name}); setIsLoginOpen(false); }} />}
      
      {isPlatformReviewOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setIsPlatformReviewOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Cuéntanos tu experiencia</h2>
            <form onSubmit={handleAddPlatformReview} className="space-y-4">
               <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tu nombre</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20" value={newPReview.userName} onChange={e => setNewPReview({...newPReview, userName: e.target.value})} />
               </div>
               <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Perfil</label>
                  <select className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20" value={newPReview.userRole} onChange={e => setNewPReview({...newPReview, userRole: e.target.value})}>
                    <option>Inquilino</option>
                    <option>Propietario</option>
                    <option>Estudiante</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Opinión</label>
                  <textarea required rows={3} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" value={newPReview.comment} onChange={e => setNewPReview({...newPReview, comment: e.target.value})} />
               </div>
               <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all">Enviar testimonio</button>
            </form>
          </div>
        </div>
      )}
      <ChatWidget />
    </div>
  );
};

export default App;
