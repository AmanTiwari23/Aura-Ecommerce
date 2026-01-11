const ProductSkeleton = () => {
  return (
    <div className="relative bg-white border border-zinc-100 overflow-hidden animate-pulse">
      
      <div className="aspect-3/4 bg-zinc-100 w-full relative">
       
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-zinc-200/50"></div>
        </div>
      </div>

      
      <div className="p-5 space-y-4">
        <div>
          
          <div className="h-2 w-24 bg-zinc-100 mb-3"></div>
          
          
          <div className="h-4 w-full bg-zinc-200 mb-2"></div>
          <div className="h-4 w-3/4 bg-zinc-200"></div>
        </div>

        
        <div className="flex items-center gap-3 pt-2">
          <div className="h-5 w-16 bg-zinc-200"></div>
          <div className="h-4 w-12 bg-zinc-100"></div>
        </div>

        
        <div className="mt-4 h-12 w-full bg-zinc-900/10"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;