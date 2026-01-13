import { 
  FiClock, 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiChevronRight 
} from "react-icons/fi";

const steps = [
  { label: "Pending", icon: <FiClock /> },
  { label: "Packed", icon: <FiPackage /> },
  { label: "Shipped", icon: <FiTruck /> },
  { label: "Delivered", icon: <FiCheckCircle /> },
];

const OrderTimeline = ({ status }) => {
  const activeIndex = steps.findIndex(s => s.label === status);

  return (
    <div className="w-full py-12 px-4">
      <div className="relative flex items-center justify-between">
        
       
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 z-0" />
        
       
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2 z-0 transition-all duration-700 ease-in-out" 
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center">
             
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isCompleted 
                    ? "bg-black text-white border-black shadow-xl scale-110" 
                    : "bg-white text-zinc-300 border-zinc-100"
                }`}
              >
                <span className="text-xl">
                    
                    {isCompleted && !isCurrent && index !== steps.length -1 ? <FiCheckCircle /> : step.icon}
                </span>
              </div>

           
              <div className="absolute top-14 flex flex-col items-center min-w-25">
                <span className={`text-[10px] uppercase tracking-[0.2em] font-black transition-colors duration-300 ${
                  isCompleted ? "text-black" : "text-zinc-400"
                }`}>
                  {step.label}
                </span>
                
                {isCurrent && (
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 animate-pulse">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;