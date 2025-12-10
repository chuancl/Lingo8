
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { WordCategory, WordEntry, MergeStrategyConfig, WordTab, Scenario } from '../types';
import { DEFAULT_MERGE_STRATEGY } from '../constants';
import { Upload, Download, Filter, Settings2, List, Search, Plus, Trash2, CheckSquare, Square, ArrowRight, BookOpen, GraduationCap, CheckCircle, RotateCcw, FileDown } from 'lucide-react';
import { MergeConfigModal } from './word-manager/MergeConfigModal';
import { AddWordModal } from './word-manager/AddWordModal';
import { WordList } from './word-manager/WordList';
import { Toast, ToastMessage } from './ui/Toast';
import { entriesStorage, enginesStorage } from '../utils/storage';
import { fetchWordDetails } from '../utils/dictionary-service';

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-pre-line text-center shadow-xl leading-relaxed min-w-[120px]">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};

// --- Import Template Definition ---
const IMPORT_TEMPLATE = [
  {
    "text": "example",
    "note": "【模式1：智能查询】仅提供单词，系统将自动调用API补全释义、音标和例句。",
    "category": "想学习单词"
  },
  {
    "text": "book",
    "translation": "预订",
    "note": "【模式2：指定释义】提供 translation 作为提示，系统将优先匹配动词含义。",
    "category": "正在学单词"
  },
  {
    "skipLookup": true,
    "text": "serendipity",
    "translation": "机缘凑巧",
    "phoneticUs": "/ˌsɛrənˈdɪpɪti/",
    "partOfSpeech": "n.",
    "contextSentence": "It was pure serendipity that we met.",
    "contextSentenceTranslation": "我们相遇纯属机缘巧合。",
    "tags": ["High Frequency", "Literary"],
    "note": "【模式3：完全自定义】设置 skipLookup: true，直接导入所有字段，不调用API。",
    "category": "已掌握单词"
  }
];

interface WordManagerProps {
  scenarios: Scenario[];
  entries: WordEntry[];
  setEntries: React.Dispatch<React.SetStateAction<WordEntry[]>>;
  ttsSpeed?: number;
}

export const WordManager: React.FC<WordManagerProps> = ({ scenarios, entries, setEntries, ttsSpeed = 1.0 }) => {
  const [activeTab, setActiveTab] = useState<WordTab>('all');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());

  // Modal States
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Configs
  const [showConfig, setShowConfig] = useState({
    showPhonetic: true,
    showMeaning: true,
  });
  
  const [mergeConfig, setMergeConfig] = useState<MergeStrategyConfig>(DEFAULT_MERGE_STRATEGY);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
     const savedConfigStr = localStorage.getItem('context-lingo-merge-config');
     if (savedConfigStr) {
         try {
             const saved = JSON.parse(savedConfigStr);
             let needsUpdate = false;
             
             // Check and append missing example order items
             const requiredItems = [
                 { id: 'inflections', label: '词态变化 (Morphology)' },
                 { id: 'phrases', label: '常用短语 (Phrases)' },
                 { id: 'roots', label: '词根词缀 (Roots)' },
                 { id: 'synonyms', label: '近义词 (Synonyms)' }
             ];

             requiredItems.forEach(req => {
                 if (!saved.exampleOrder.some((item: any) => item.id === req.id)) {
                     saved.exampleOrder.push({ ...req, enabled: true });
                     needsUpdate = true;
                 }
             });

             // Check missing boolean flags
             if (typeof saved.showPartOfSpeech === 'undefined') { saved.showPartOfSpeech = true; needsUpdate = true; }
             if (typeof saved.showTags === 'undefined') { saved.showTags = true; needsUpdate = true; }
             if (typeof saved.showImportance === 'undefined') { saved.showImportance = true; needsUpdate = true; }
             if (typeof saved.showCocaRank === 'undefined') { saved.showCocaRank = true; needsUpdate = true; }
             if (typeof saved.showImage === 'undefined') { saved.showImage = true; needsUpdate = true; }
             if (typeof saved.showVideo === 'undefined') { saved.showVideo = true; needsUpdate = true; }
             
             if (typeof saved.showExampleTranslation === 'undefined') { saved.showExampleTranslation = true; needsUpdate = true; }
             if (typeof saved.showContextTranslation === 'undefined') { saved.showContextTranslation = true; needsUpdate = true; }

             if (needsUpdate) {
                 localStorage.setItem('context-lingo-merge-config', JSON.stringify(saved));
             }
             setMergeConfig(saved);
         } catch (e) {
             console.error("Failed to load merge config", e);
             setMergeConfig(DEFAULT_MERGE_STRATEGY);
         }
     } else {
         setMergeConfig(DEFAULT_MERGE_STRATEGY);
         localStorage.setItem('context-lingo-merge-config', JSON.stringify(DEFAULT_MERGE_STRATEGY));
     }
  }, []);

  useEffect(() => {
      localStorage.setItem('context-lingo-merge-config', JSON.stringify(mergeConfig));
  }, [mergeConfig]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedWords(new Set());
  }, [activeTab, selectedScenarioId]);

  useEffect(() => {
    if (selectedScenarioId !== 'all' && !scenarios.find(s => s.id === selectedScenarioId)) {
      setSelectedScenarioId('all');
    }
  }, [scenarios, selectedScenarioId]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
      setToast({ id: Date.now(), message, type });
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (activeTab !== 'all') {
        if (e.category !== activeTab) return false;
      }
      if (selectedScenarioId !== 'all') {
         if (e.scenarioId !== selectedScenarioId) return false;
      }
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        const matchText = e.text.toLowerCase().includes(lowerQ);
        const matchTrans = e.translation?.includes(lowerQ) || false;
        if (!matchText && !matchTrans) return false;
      }
      return true; 
    });
  }, [entries, activeTab, selectedScenarioId, searchQuery]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, WordEntry[]> = {};
    filteredEntries.forEach(entry => {
      let key = entry.text.toLowerCase().trim();
      if (mergeConfig.strategy === 'by_word_and_meaning') {
        key = `${key}::${entry.translation?.trim()}`;
      }
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(entry);
    });
    const sortedGroups = Object.values(groups).map(group => {
       return group.sort((a, b) => b.addedAt - a.addedAt);
    });
    return sortedGroups.sort((a, b) => {
       const maxA = a[0].addedAt; 
       const maxB = b[0].addedAt;
       return maxB - maxA;
    });
  }, [filteredEntries, mergeConfig.strategy]);

  const allVisibleIds = useMemo(() => filteredEntries.map(e => e.id), [filteredEntries]);
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every(id => selectedWords.has(id));
  const isAllWordsTab = activeTab === 'all';

  const toggleSelectAll = () => {
    if (allSelected) {
      const newSet = new Set(selectedWords);
      allVisibleIds.forEach(id => newSet.delete(id));
      setSelectedWords(newSet);
    } else {
      const newSet = new Set(selectedWords);
      allVisibleIds.forEach(id => newSet.add(id));
      setSelectedWords(newSet);
    }
  };

  const toggleSelectGroup = (group: WordEntry[]) => {
    const newSet = new Set(selectedWords);
    const groupIds = group.map(g => g.id);
    const isGroupSelected = groupIds.every(id => newSet.has(id));

    if (isGroupSelected) {
      groupIds.forEach(id => newSet.delete(id));
    } else {
      groupIds.forEach(id => newSet.add(id));
    }
    setSelectedWords(newSet);
  };

  const isGroupSelected = (group: WordEntry[]) => {
    return group.every(e => selectedWords.has(e.id));
  };

  const handleDeleteSelected = () => {
    if (selectedWords.size === 0) return;

    if (confirm(`确定从当前列表删除选中的 ${selectedWords.size} 个单词吗？`)) {
      setEntries(prev => prev.filter(e => !selectedWords.has(e.id)));
      setSelectedWords(new Set());
      showToast('删除成功', 'success');
    }
  };

  const handleBatchMove = (targetCategory: WordCategory) => {
      if (selectedWords.size === 0) return;
      const newEntries = entries.map(e => {
          if (selectedWords.has(e.id)) {
              return { ...e, category: targetCategory };
          }
          return e;
      });
      setEntries(newEntries);
      setSelectedWords(new Set());
      showToast('移动成功', 'success');
  };

  const handleExport = () => {
     let dataToExport: WordEntry[];
     if (selectedWords.size > 0) {
        dataToExport = entries.filter(e => selectedWords.has(e.id));
     } else {
        dataToExport = filteredEntries;
     }

     if (dataToExport.length === 0) {
        showToast('当前列表为空，无法导出', 'warning');
        return;
     }

     const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     const prefix = selectedWords.size > 0 ? 'selected' : activeTab;
     a.download = `contextlingo_export_${prefix}_${dataToExport.length}words_${Date.now()}.json`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     URL.revokeObjectURL(url);
     showToast(`成功导出 ${dataToExport.length} 个单词`, 'success');
  };

  const handleDownloadTemplate = () => {
      const blob = new Blob([JSON.stringify(IMPORT_TEMPLATE, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lingoflow_import_template.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('模板已下载', 'success');
  };

  const triggerImport = () => {
     if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;

     const reader = new FileReader();
     reader.onload = async (event) => {
        const text = event.target?.result as string;
        let candidates: any[] = [];
        
        try {
           candidates = JSON.parse(text);
           if (!Array.isArray(candidates)) {
               throw new Error("JSON Root is not an array");
           }
        } catch (err) {
           showToast("文件格式错误：仅支持符合模板规范的 JSON 文件。", "error");
           e.target.value = ''; 
           return;
        }

        const targetCategoryDefault = activeTab === 'all' ? WordCategory.WantToLearnWord : activeTab;
        
        // Engine Check: Only needed if there are candidates without 'skipLookup'
        const needsEngine = candidates.some(c => !c.skipLookup);
        let activeEngine = null;
        
        if (needsEngine) {
            const engines = await enginesStorage.getValue();
            activeEngine = engines.find(e => e.isEnabled);
            if (!activeEngine) {
                showToast("检测到需智能查询的词条，但未启用任何翻译引擎，导入已中止。", "error");
                e.target.value = ''; 
                return;
            }
        }

        let successCount = 0;
        let failCount = 0;
        showToast(`开始处理 ${candidates.length} 个单词，请稍候...`, 'info');
        const newEntriesToAdd: WordEntry[] = [];

        // Helper to check duplicates
        const isDuplicate = (t: string, trans?: string) => {
            const existing = entries.some(e => 
                e.text.toLowerCase() === t.toLowerCase() && 
                (e.translation?.trim() === trans?.trim())
            );
            const inBatch = newEntriesToAdd.some(e => 
                e.text.toLowerCase() === t.toLowerCase() && 
                (e.translation?.trim() === trans?.trim())
            );
            return existing || inBatch;
        };

        for (const candidate of candidates) {
            if (!candidate.text || typeof candidate.text !== 'string') {
                failCount++; 
                continue;
            }

            const category = candidate.category || targetCategoryDefault;
            const scenarioId = selectedScenarioId === 'all' ? '1' : selectedScenarioId;

            try {
                // Mode 1: Skip Lookup (Direct Import)
                if (candidate.skipLookup) {
                    if (isDuplicate(candidate.text, candidate.translation)) {
                        failCount++;
                        continue;
                    }

                    newEntriesToAdd.push({
                        id: `import-direct-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        text: candidate.text,
                        translation: candidate.translation || '',
                        phoneticUs: candidate.phoneticUs,
                        phoneticUk: candidate.phoneticUk,
                        partOfSpeech: candidate.partOfSpeech,
                        englishDefinition: candidate.englishDefinition,
                        contextSentence: candidate.contextSentence,
                        contextSentenceTranslation: candidate.contextSentenceTranslation,
                        mixedSentence: candidate.mixedSentence,
                        dictionaryExample: candidate.dictionaryExample,
                        dictionaryExampleTranslation: candidate.dictionaryExampleTranslation,
                        inflections: candidate.inflections || [],
                        tags: candidate.tags || [],
                        importance: candidate.importance || 0,
                        cocaRank: candidate.cocaRank || 0,
                        phrases: candidate.phrases || [],
                        roots: candidate.roots || [],
                        synonyms: candidate.synonyms || [],
                        image: candidate.image,
                        video: candidate.video,
                        category,
                        addedAt: Date.now(),
                        scenarioId,
                        sourceUrl: candidate.sourceUrl
                    });
                    successCount++;
                } 
                // Mode 2: Smart Lookup (Rich Fetch)
                else if (activeEngine) {
                    const detailsList = await fetchWordDetails(candidate.text, candidate.translation, activeEngine);
                    
                    if (detailsList.length === 0) {
                        failCount++; // No dictionary data found
                    }

                    for (const details of detailsList) {
                         if (!details.text) continue;
                         if (isDuplicate(details.text, details.translation)) continue;

                         newEntriesToAdd.push({
                            id: `import-smart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                            text: details.text!,
                            translation: details.translation || '',
                            phoneticUs: details.phoneticUs,
                            phoneticUk: details.phoneticUk,
                            
                            partOfSpeech: details.partOfSpeech, 

                            contextSentence: details.contextSentence,
                            mixedSentence: details.mixedSentence,
                            dictionaryExample: details.dictionaryExample,
                            dictionaryExampleTranslation: details.dictionaryExampleTranslation,
                            
                            inflections: details.inflections || [], 
                            tags: details.tags || [],
                            importance: details.importance || 0,
                            cocaRank: details.cocaRank || 0,
                            englishDefinition: details.englishDefinition,
                            
                            category, // User specified or current tab
                            addedAt: Date.now(),
                            scenarioId,
                         });
                         successCount++;
                    }
                }
            } catch (err) {
                console.error(err);
                failCount++;
            }
        }

        if (newEntriesToAdd.length > 0) {
            setEntries(prev => [...prev, ...newEntriesToAdd]);
            showToast(`导入完成: 新增 ${successCount}, 失败/重复 ${failCount}`, 'success');
        } else {
             showToast(`导入结束: 没有新增单词 (全部重复或失败)`, 'warning');
        }
     };
     reader.readAsText(file);
     e.target.value = ''; 
  };

  // Add Word Handler from Modal
  const handleAddWord = async (entryData: Partial<WordEntry>) => {
      try {
          // Check for Duplicates (Text + Translation)
          const isDuplicate = entries.some(e => 
              e.text.toLowerCase() === entryData.text?.toLowerCase() && 
              e.translation?.trim() === entryData.translation?.trim()
          );

          if (isDuplicate) {
              showToast(`"${entryData.text}" (${entryData.translation}) 已存在，未重复添加。`, 'warning');
              return;
          }

          // Determine Category: Priority 1: Modal Data, Priority 2: Active Tab Context, Default: WantToLearn
          let targetCategory = entryData.category;
          if (!targetCategory) {
              targetCategory = activeTab === 'all' ? WordCategory.WantToLearnWord : activeTab;
          }

          const newEntry: WordEntry = {
              id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              text: entryData.text!,
              translation: entryData.translation,
              englishDefinition: entryData.englishDefinition,
              phoneticUs: entryData.phoneticUs,
              phoneticUk: entryData.phoneticUk,
              contextSentence: entryData.contextSentence,
              mixedSentence: entryData.mixedSentence,
              dictionaryExample: entryData.dictionaryExample,
              dictionaryExampleTranslation: entryData.dictionaryExampleTranslation,
              inflections: entryData.inflections || [],
              tags: entryData.tags || [],
              importance: entryData.importance || 0,
              cocaRank: entryData.cocaRank || 0,
              partOfSpeech: entryData.partOfSpeech, 
              
              // Public Fields
              phrases: entryData.phrases || [],
              roots: entryData.roots || [],
              synonyms: entryData.synonyms || [],
              image: entryData.image,
              video: entryData.video,

              category: targetCategory,
              addedAt: entryData.addedAt || Date.now(),
              scenarioId: selectedScenarioId === 'all' ? '1' : selectedScenarioId,
          };

          setEntries(prev => [newEntry, ...prev]);
          showToast('添加成功', 'success');
      } catch (e: any) {
          console.error(e);
          showToast('添加失败', 'error');
      }
  };

  const handleDragStart = (index: number) => setDraggedItemIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newOrder = [...mergeConfig.exampleOrder];
    const draggedItem = newOrder[draggedItemIndex];
    newOrder.splice(draggedItemIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    setMergeConfig({ ...mergeConfig, exampleOrder: newOrder });
    setDraggedItemIndex(index);
  };
  const handleDragEnd = () => setDraggedItemIndex(null);
  
  const getTabLabel = (tab: WordTab) => tab === 'all' ? '所有单词' : tab;

  const getTabDescription = (tab: WordTab) => {
      if (tab === 'all') return "包含所有状态的单词";
      if (tab === WordCategory.WantToLearnWord) return "计划未来要学习的单词";
      if (tab === WordCategory.LearningWord) return "已经在网页上碰到过的单词";
      if (tab === WordCategory.KnownWord) return "已经会的单词";
      return "";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col relative min-h-[600px]">
      <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImportFile} />

      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="border-b border-slate-200 px-6 py-5 bg-slate-50 rounded-t-xl flex justify-between items-center flex-wrap gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">词汇库管理</h2>
           <p className="text-sm text-slate-500 mt-1">管理、筛选及编辑您的个性化词库</p>
        </div>
        <div>
           <Tooltip text="配置合并策略、显示内容及顺序">
              <button 
                onClick={() => setIsMergeModalOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm shadow-blue-200"
              >
                <Settings2 className="w-4 h-4 mr-2" /> 显示配置
              </button>
           </Tooltip>
        </div>
      </div>
      
      <AddWordModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onConfirm={handleAddWord}
        initialCategory={activeTab === 'all' ? WordCategory.WantToLearnWord : activeTab}
      />

      <MergeConfigModal 
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        mergeConfig={mergeConfig}
        setMergeConfig={setMergeConfig}
        showConfig={showConfig}
        setShowConfig={setShowConfig}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDragEnd={handleDragEnd}
        draggedItemIndex={draggedItemIndex}
      />

      <div className="border-b border-slate-200 bg-white p-4 space-y-4">
        <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
          {(['all', ...Object.values(WordCategory)] as WordTab[]).map((tab) => (
            <Tooltip key={tab} text={getTabDescription(tab)}>
                <button
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all flex items-center ${
                    activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                >
                {tab === 'all' && <List className="w-4 h-4 mr-2" />}
                {getTabLabel(tab)}
                </button>
            </Tooltip>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
           <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center">
                 <button onClick={toggleSelectAll} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 select-none">
                    {allSelected ? <CheckSquare className="w-5 h-5 mr-2 text-blue-600"/> : <Square className="w-5 h-5 mr-2 text-slate-400"/>}
                    全选
                 </button>
              </div>
              
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select 
                    value={selectedScenarioId}
                    onChange={(e) => setSelectedScenarioId(e.target.value)}
                    className="text-sm border-none bg-transparent focus:ring-0 text-slate-700 font-medium cursor-pointer hover:bg-slate-100 rounded"
                  >
                    <option value="all">所有场景</option>
                    {scenarios.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
              </div>

              <div className="flex items-center space-x-2 border-l border-slate-200 pl-4 flex-1 max-w-xs">
                 <Search className="w-4 h-4 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="搜索单词或释义..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm border-none bg-transparent focus:ring-0 text-slate-700 placeholder:text-slate-400"
                 />
              </div>
           </div>

           <div className="flex gap-2 items-center">
              {selectedWords.size > 0 ? (
                 <>
                    {activeTab === WordCategory.KnownWord && (
                        <>
                           <button onClick={() => handleBatchMove(WordCategory.WantToLearnWord)} className="flex items-center px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-lg hover:bg-amber-100 transition animate-in slide-in-from-right-2">
                              <RotateCcw className="w-4 h-4 mr-2" /> 移至想学
                           </button>
                           <button onClick={() => handleBatchMove(WordCategory.LearningWord)} className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition animate-in slide-in-from-right-2">
                              <BookOpen className="w-4 h-4 mr-2" /> 移至正在学
                           </button>
                        </>
                    )}
                    {activeTab === WordCategory.WantToLearnWord && (
                        <>
                            <button onClick={() => handleBatchMove(WordCategory.LearningWord)} className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition animate-in slide-in-from-right-2">
                               <ArrowRight className="w-4 h-4 mr-2" /> 开始学习
                            </button>
                            <button onClick={() => handleBatchMove(WordCategory.KnownWord)} className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition animate-in slide-in-from-right-2">
                               <CheckCircle className="w-4 h-4 mr-2" /> 设为已掌握
                            </button>
                        </>
                    )}
                    {activeTab === WordCategory.LearningWord && (
                         <>
                            <button onClick={() => handleBatchMove(WordCategory.WantToLearnWord)} className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition animate-in slide-in-from-right-2">
                               <RotateCcw className="w-4 h-4 mr-2" /> 移回想学
                            </button>
                            <button onClick={() => handleBatchMove(WordCategory.KnownWord)} className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition animate-in slide-in-from-right-2">
                               <GraduationCap className="w-4 h-4 mr-2" /> 设为已掌握
                            </button>
                         </>
                    )}
                    <div className="w-px h-6 bg-slate-300 mx-2"></div>
                    <button onClick={handleExport} className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition animate-in slide-in-from-right-2">
                        <Download className="w-4 h-4 mr-2" /> 导出 ({selectedWords.size})
                    </button>
                    <button onClick={handleDeleteSelected} className="flex items-center px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition animate-in slide-in-from-right-2">
                        <Trash2 className="w-4 h-4 mr-2" /> 删除 ({selectedWords.size})
                    </button>
                 </>
              ) : (
                  <>
                    {!isAllWordsTab && (
                        <>
                        <Tooltip text={`手动添加单词至"${getTabLabel(activeTab)}"`}>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                            >
                                <Plus className="w-4 h-4 mr-2" /> 新增
                            </button>
                        </Tooltip>

                        <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden divide-x divide-slate-200">
                            <Tooltip text="下载标准导入模板 (JSON)">
                                <button 
                                    onClick={handleDownloadTemplate}
                                    className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                                >
                                <FileDown className="w-4 h-4 mr-2" /> 模板
                                </button>
                            </Tooltip>
                            
                            <Tooltip text="支持 JSON 格式文件。智能模式下会自动查询释义。">
                                <button 
                                    onClick={triggerImport}
                                    className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                                >
                                <Upload className="w-4 h-4 mr-2" /> 导入
                                </button>
                            </Tooltip>
                        </div>
                        </>
                    )}

                    {isAllWordsTab && (
                        <Tooltip text="导出当前列表">
                            <button 
                                onClick={handleExport}
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                            >
                            <Download className="w-4 h-4 mr-2" /> 导出
                            </button>
                        </Tooltip>
                    )}
                  </>
              )}
           </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 space-y-4 flex-1">
        <WordList 
           groupedEntries={groupedEntries}
           selectedWords={selectedWords}
           toggleSelectGroup={toggleSelectGroup}
           isGroupSelected={isGroupSelected}
           showConfig={showConfig}
           mergeConfig={mergeConfig}
           isAllWordsTab={isAllWordsTab}
           searchQuery={searchQuery}
           ttsSpeed={ttsSpeed}
        />
      </div>
    </div>
  );
};
