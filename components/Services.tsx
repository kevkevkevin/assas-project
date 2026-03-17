import { CarFront, ArrowRightLeft, Banknote, ShieldCheck } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <CarFront size={32} className="text-white" />,
      title: "Premium Car Rentals",
      description: "Choose from our wide range of luxury and economy vehicles for your daily or monthly needs.",
    },
    {
      icon: <ArrowRightLeft size={32} className="text-white" />, // Highlighting this as the unique feature
      title: "Lease Transfer (Settlement)",
      description: "Stuck in a lease? List your car for transfer or find a short-term lease deal without the long commitment.",
    },
    {
      icon: <Banknote size={32} className="text-white" />,
      title: "Easy Financing",
      description: "Get pre-approved for your dream car with our streamlined digital financing application.",
    },
    {
      icon: <ArrowRightLeft size={32} className="text-white" />,
      title: "Car Swapping",
      description: "Upgrade your ride effortlessly by trading in your current vehicle for a newer model with our instant valuation and swap process.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            More than just a rental platform
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We are your one-stop solution for all automotive needs. Whether you want to rent, swap, or finance, we have you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-3xl border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300 bg-white"
            >
              {/* Icon Circle - Orange Background */}
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              
              <p className="text-gray-500 leading-relaxed">
                {service.description}
              </p>

              {/* "Learn More" Link */}
              <div className="mt-6">
                <button className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  Learn More <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust/Safety Banner (Bonus) */}
        <div className="mt-20 bg-gray-900 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           {/* Decorative Background Blob */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

           <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                 Secure & Verified Transactions
              </h3>
              <p className="text-gray-400 max-w-lg">
                 All lease transfers and rentals are verified by our team to ensure a safe settlement process for everyone.
              </p>
           </div>
           
           <div className="relative z-10">
              <button className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-orange-900/20 transition-transform hover:scale-105 flex items-center gap-2">
                 <ShieldCheck size={20} />
                 Verify My Account
              </button>
           </div>
        </div>

      </div>
    </section>
  );
}