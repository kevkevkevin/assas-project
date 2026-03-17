import { Fuel, Gauge, Users, Heart } from "lucide-react";
import Image from "next/image";

// Define what data a "Car" needs
interface CarProps {
  name: string;
  type: string;
  image: string;
  fuel: string;
  transmission: string;
  seats: number;
  price: number;
}

// Added "isSwap" prop (optional, defaults to false)
export default function CarCard({ data, isSwap = false }: { data: CarProps; isSwap?: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
          <p className="text-gray-400 text-sm font-medium">{data.type}</p>
        </div>
        <button className="text-gray-400 hover:text-red-500">
          <Heart size={20} />
        </button>
      </div>

      {/* Car Image Area */}
      <div className="relative w-full h-40 mb-8 flex items-center justify-center">
        <img 
          src={data.image} 
          alt={data.name} 
          className="object-contain h-full w-full drop-shadow-xl" 
        />
        <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Specs Row */}
      <div className="flex justify-between text-gray-500 text-sm mb-6 mt-auto">
        <div className="flex items-center gap-1 font-medium"><Fuel size={16} className="text-gray-400"/> {data.fuel}</div>
        <div className="flex items-center gap-1 font-medium"><Gauge size={16} className="text-gray-400"/> {data.transmission}</div>
        <div className="flex items-center gap-1 font-medium"><Users size={16} className="text-gray-400"/> {data.seats} People</div>
      </div>

      {/* Footer: Dynamic Layout based on isSwap */}
      <div className={`mt-4 pt-4 border-t border-gray-50 ${isSwap ? 'flex' : 'flex justify-between items-center'}`}>
        
        {isSwap ? (
            // LAYOUT A: SWAP (Full width button, no price)
            <button className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-sm shadow-orange-100">
                Inquire Swap
            </button>
        ) : (
            // LAYOUT B: RENTAL (Price + Rent Button)
            <>
                <div>
                    <div className="flex items-center gap-1">
                    <Image 
                        src="/saudiriyal_newsymbol.png" 
                        alt="SR" 
                        width={13} 
                        height={13} 
                        className="object-contain"
                    />
                    <p className="text-xl font-bold text-gray-900">
                        {data.price}
                        <span className="text-sm text-gray-400 font-normal">/day</span>
                    </p>
                    </div>
                </div>
                <button className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm shadow-orange-100">
                    Rent Now
                </button>
            </>
        )}
      </div>
    </div>
  );
}