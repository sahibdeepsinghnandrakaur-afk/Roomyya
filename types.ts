
export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface PlatformReview {
  id: string;
  userName: string;
  userRole: string; // Ej: "Inquilino", "Propietario"
  rating: number;
  comment: string;
  avatar: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  location: string;
  amenities: string[];
  ownerName: string;
  phone: string;
  reviews: Review[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
