import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const SalesChart = ({ data }) => {
 
  const chartData = data.map(item => ({
    date: item._id,
    sales: item.totalSales,
    orders: item.orderCount
  }));

  return (
    <div className="h-[350px] w-full bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Revenue Performance</h3>
        <p className="text-2xl font-black uppercase tracking-tighter">Weekly Analytics</p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#000" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 9, fontWeight: 700, fill: '#a1a1aa'}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 9, fontWeight: 700, fill: '#a1a1aa'}} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '900'}}
            itemStyle={{ color: '#000' }}
          />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#000" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSales)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;