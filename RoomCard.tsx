
import React from 'react';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  onViewDetail: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onViewDetail }) => {
  const avgRating = room.reviews.length > 0 
    ? (room.reviews.reduce((acc, r) => acc + r.rating, 0) / room.reviews.length).toFixed(1)
    : null;

  return (
    <div 
      onClick={() => onViewDetail(room)}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 group"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={room.image} 
          alt={room.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
          ${room.price}/mes
        </div>
        {avgRating && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-black text-slate-800 shadow-sm flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {avgRating} ({room.reviews.length})
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 truncate mb-1">{room.title}</h3>
        <p className="text-sm text-slate-500 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {room.location}
        </p>
        <div className="flex flex-wrap gap-1">
          {room.amenities.slice(0, 2).map((amenity, idx) => (
            <span key={idx} className="text-[9px] uppercase tracking-wider font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded border border-slate-100">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
