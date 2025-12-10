
import React, { useMemo } from 'react';
import { WordEntry, WordCategory, Scenario } from '../types';
import { Activity, BookOpen, CheckCircle, Clock, Zap, MapPin, Tag } from 'lucide-react';

interface DashboardProps {
  entries: WordEntry[];
  scenarios?: Scenario[];
}

// --- Chart 1: Smooth Area Chart (Growth Trend) ---
const GrowthAreaChart = ({ data, color = '#3b82f6', height = 160 }: { data: number[], color?: string, height?: number }) => {
    if (data.length < 2) return (
        <div className="flex items-center justify-center h-full text-slate-300 text-xs italic">
            积累更多数据以查看趋势
        </div>
    );

    const width = 1000; 
    const max = Math.max(...data, 1);
    const min = 0;
    
    // Generate points
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / (max - min)) * height; // Invert Y
        return `${x},${y}`;
    }).join(' ');

    // Fill area path (start at bottom left, go to points, end at bottom right)
    const fillPath = `M0,${height} ${points} L${width},${height} Z`;

    return (
        <div className="w-full h-full relative overflow-hidden group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Grid Lines */}
                <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1={height * 0.50} x2={width} y2={height * 0.50} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                <path d={fillPath} fill="url(#growthGradient)" />
                <polyline 
                    points={points} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    vectorEffect="non-scaling-stroke"
                />
                
                {/* Highlight last point */}
                <circle cx={width} cy={height - ((data[data.length-1] - min) / (max - min) * height)} r="4" fill="white" stroke={color} strokeWidth="3" />
            </svg>
        </div>
    );
};

// --- Chart 2: Consistency Heatmap (GitHub Style) ---
const ConsistencyHeatmap = ({ dates }: { dates: string[] }) => {
    // Generate last 16 weeks (approx 4 months)
    const weeks = 20; 
    const days = weeks * 7;
    const today = new Date();
    
    // Map of date string YYYY-MM-DD -> count
    const activityMap = new Map<string, number>();
    dates.forEach(d => {
        activityMap.set(d, (activityMap.get(d) || 0) + 1);
    });

    const cells = [];
    // Start from `days` ago
    for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - (days - 1 - i));
        const dateStr = d.toISOString().split('T')[0];
        const count = activityMap.get(dateStr) || 0;
        
        let colorClass = "bg-slate-100";
        if (count > 0) colorClass = "bg-green-200";
        if (count > 2) colorClass = "bg-green-300";
        if (count > 5) colorClass = "bg-green-400";
        if (count > 10) colorClass = "bg-green-500";
        if (count > 15) colorClass = "bg-green-600";

        cells.push(
            <div 
                key={dateStr} 
                className={`w-3 h-3 rounded-[2px] ${colorClass} hover:ring-1 hover:ring-slate-400 transition-all`}
                title={`${dateStr}: ${count} 个单词`}
            ></div>
        );
    }

    return (
        <div className="flex flex-wrap gap-1 content-start w-full h-full overflow-hidden">
            {cells}
        </div>
    );
};

// --- Chart 3: Horizontal Bar Chart (Source Analysis) ---
const SourceBarChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    
    return (
        <div className="space-y-3 w-full">
            {data.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                    <div className="w-24 text-right truncate text-slate-500 font-medium" title={item.label}>{item.label}</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
                        ></div>
                    </div>
                    <div className="w-8 text-slate-600 font-bold">{item.value}</div>
                </div>
            ))}
            {data.length === 0 && <div className="text-center text-slate-300 text-xs py-4">暂无来源数据</div>}
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ entries, scenarios = [] }) => {
  
  // --- Data Processing ---
  const stats = useMemo(() => {
      const total = entries.length;
      const want = entries.filter(e => e.category === WordCategory.WantToLearnWord).length;
      const learning = entries.filter(e => e.category === WordCategory.LearningWord).length;
      const known = entries.filter(e => e.category === WordCategory.KnownWord).length;
      
      const learningRate = total > 0 ? Math.round(((learning + known) / total) * 100) : 0;

      // 1. Trend Data (Last 30 Days Cumulative)
      const now = new Date();
      const last30DaysLabels = Array.from({length: 30}, (_, i) => {
          const d = new Date(now);
          d.setDate(d.getDate() - (29 - i));
          return d.toISOString().split('T')[0];
      });
      
      // Cumulative calculation
      let cumulative = 0;
      // Sort all entries by date ascending first
      const sortedEntries = [...entries].sort((a, b) => a.addedAt - b.addedAt);
      
      const trendData = last30DaysLabels.map(dateStr => {
          // Count words added strictly BEFORE or ON this date
          // For a simpler "Trend", let's just count total active words up to that day
          // Filter entries where addedAt date <= current loop date
          const count = sortedEntries.filter(e => new Date(e.addedAt).toISOString().split('T')[0] <= dateStr).length;
          return count;
      });

      // 2. Activity Dates (For Heatmap)
      const activityDates = entries.map(e => new Date(e.addedAt).toISOString().split('T')[0]);
      const todayCount = activityDates.filter(d => d === now.toISOString().split('T')[0]).length;

      // 3. Source Analysis
      const domainCount: Record<string, number> = {};
      entries.forEach(e => {
          if (e.sourceUrl) {
              try {
                  const hostname = new URL(e.sourceUrl).hostname.replace('www.', '');
                  domainCount[hostname] = (domainCount[hostname] || 0) + 1;
              } catch {}
          } else {
              domainCount['Manual / Unknown'] = (domainCount['Manual / Unknown'] || 0) + 1;
          }
      });
      const sourceData = Object.entries(domainCount)
          .map(([label, value]) => ({ label, value, color: '#6366f1' })) // Indigo
          .sort((a, b) => b.value - a.value);

      // 4. Tag Analysis
      const tagCount: Record<string, number> = {};
      entries.forEach(e => {
          if (e.tags && e.tags.length > 0) {
              e.tags.forEach(t => tagCount[t] = (tagCount[t] || 0) + 1);
          } else {
              tagCount['No Tag'] = (tagCount['No Tag'] || 0) + 1;
          }
      });
      const tagData = Object.entries(tagCount)
          .map(([label, value]) => ({ label, value, color: '#10b981' })) // Emerald
          .sort((a, b) => b.value - a.value);

      return { total, want, learning, known, learningRate, trendData, activityDates, todayCount, sourceData, tagData };
  }, [entries]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-blue-600" />
                学习概览
            </h2>
            <p className="text-sm text-slate-500 mt-1">
                今日新增 <span className="font-bold text-blue-600">+{stats.todayCount}</span> 个单词，坚持就是胜利！
            </p>
        </div>
      </div>

      {/* Metric Cards (Bento Top) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen className="w-16 h-16 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">词汇总量</span>
              <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{stats.total}</span>
                  <span className="text-xs text-blue-600 font-bold mb-1.5 bg-blue-50 px-1.5 rounded">All</span>
              </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 border-l-4 border-l-amber-500">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">想学习 (Want)</span>
              <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-amber-600 tracking-tight">{stats.want}</span>
                  <span className="text-xs text-slate-400 font-medium mb-1.5">waiting</span>
              </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 border-l-4 border-l-red-500">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">正在学 (Learning)</span>
              <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-red-600 tracking-tight">{stats.learning}</span>
                  <span className="text-xs text-slate-400 font-medium mb-1.5">active</span>
              </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 border-l-4 border-l-emerald-500">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">已掌握 (Mastered)</span>
              <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-emerald-600 tracking-tight">{stats.known}</span>
                  <div className="mb-1.5 ml-auto">
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{stats.learningRate}% Rate</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-80">
          {/* Left: Growth Trend (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-amber-500"/> 
                      词汇积累趋势 (近30天)
                  </h3>
              </div>
              <div className="flex-1 min-h-[160px]">
                  <GrowthAreaChart data={stats.trendData} />
              </div>
          </div>

          {/* Right: Sources (1 Col) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col overflow-hidden">
              <h3 className="font-bold text-slate-800 flex items-center mb-6">
                  <MapPin className="w-4 h-4 mr-2 text-indigo-500"/>
                  来源分布
              </h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <SourceBarChart data={stats.sourceData} />
              </div>
          </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Consistency Heatmap (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-green-600"/>
                      学习一致性 (Consistency)
                  </h3>
                  <div className="flex gap-1 text-[10px] text-slate-400 items-center">
                      <span>Less</span>
                      <div className="w-2 h-2 bg-slate-100 rounded-[1px]"></div>
                      <div className="w-2 h-2 bg-green-300 rounded-[1px]"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-[1px]"></div>
                      <div className="w-2 h-2 bg-green-700 rounded-[1px]"></div>
                      <span>More</span>
                  </div>
              </div>
              <div className="w-full">
                  <ConsistencyHeatmap dates={stats.activityDates} />
              </div>
          </div>

          {/* Right: Tags Radar (Simulated as Bar) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <h3 className="font-bold text-slate-800 flex items-center mb-4">
                  <Tag className="w-4 h-4 mr-2 text-emerald-500"/>
                  词汇等级分布
              </h3>
              <div className="flex-1">
                  <SourceBarChart data={stats.tagData} />
              </div>
          </div>
      </div>
    </div>
  );
};
