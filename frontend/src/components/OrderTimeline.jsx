const steps = ["Pending", "Packed", "Shipped", "Delivered"];

const OrderTimeline = ({ status }) => {
  const activeIndex = steps.indexOf(status);

  return (
    <div className="flex items-center justify-between my-6">
      {steps.map((step, index) => (
        <div key={step} className="flex-1 flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white 
              ${index <= activeIndex ? "bg-green-500" : "bg-gray-300"}`}
          >
            {index + 1}
          </div>

          <span
            className={`ml-2 ${
              index <= activeIndex ? "font-bold text-green-600" : "text-gray-500"
            }`}
          >
            {step}
          </span>

          {index !== steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 ${
                index < activeIndex ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;
