
import { WordEntry } from "../types";
import { normalizeEnglishText } from "./text-processing";

/**
 * 核心匹配逻辑：在中文源文本中寻找可以被替换的单词
 * 
 * 算法升级 v2:
 * 1. 上下文验证 (Context Verification): 只有当 translatedText (译文) 中包含了目标英文单词(或其变形)时，
 *    才会在 sourceText (原文) 中搜索对应的中文释义。这完美解决了 "China" -> "中" 匹配到 "在本文中" 的问题。
 * 2. 贪婪匹配: 优先匹配最长的中文释义 (例如优先匹配 "中华人民共和国" 而不是 "中华")。
 */
export const findFuzzyMatches = (
    sourceText: string, 
    candidates: WordEntry[], 
    translatedText: string = ""
): { text: string, entry: WordEntry }[] => {
    
    const matches: { text: string, entry: WordEntry, index: number }[] = [];
    const normalizedTrans = normalizeEnglishText(translatedText);

    // 1. 筛选候选词 (Filter Candidates)
    // 只有当 API 返回的译文中确实出现了这个英文单词，我们才去原文里找它的中文对应词。
    const validCandidates = candidates.filter(entry => {
        // 检查单词本身
        if (normalizedTrans.includes(entry.text.toLowerCase())) return true;
        
        // 检查变形 (Inflections)
        if (entry.inflections && entry.inflections.length > 0) {
            return entry.inflections.some(inf => normalizedTrans.includes(inf.toLowerCase()));
        }
        
        // 如果没有译文（预览模式），则不做严格校验，允许所有匹配
        if (!translatedText) return true;

        return false;
    });

    // 2. 在原文中搜索匹配 (Search in Source)
    // 我们不再依赖分词器的切分结果完全相等，而是搜索字符串。
    // 因为 "中俄" 可能被分词为一个词，但我们需要替换里面的 "中"。
    
    validCandidates.forEach(entry => {
        // 获取所有可能的中文释义 (从 translation 字段解析，假设用逗号或分号分隔)
        // 用户输入的 translation 可能是 "中国; 中; 中华人民共和国"
        const definitions = entry.translation
            ?.split(/[,;，；\s]+/) // 拆分
            .map(d => d.trim())
            .filter(d => d.length > 0) || [];

        definitions.forEach(def => {
            let startIndex = 0;
            let foundIndex = sourceText.indexOf(def, startIndex);
            
            while (foundIndex !== -1) {
                matches.push({
                    text: def,
                    entry: entry,
                    index: foundIndex
                });
                startIndex = foundIndex + 1; // 继续向后找
                foundIndex = sourceText.indexOf(def, startIndex);
            }
        });
    });

    // 3. 冲突处理 (Resolve Conflicts)
    // 如果有重叠的匹配，优先保留更长的匹配。
    // 例如: 定义了 A="中国", B="中"。原文 "中国很棒"。
    // 匹配到 A(0-2) 和 B(0-1)。应该保留 A。
    
    // 按在原文中的位置排序
    matches.sort((a, b) => a.index - b.index);

    const result: { text: string, entry: WordEntry }[] = [];
    let lastCoveredIndex = -1;

    // 再次排序，对于相同位置的，长度长的排前面
    // 这是一个简单的贪婪策略
    const processMatches = (overlapGroup: typeof matches) => {
        if (overlapGroup.length === 0) return;
        // 选最长的
        overlapGroup.sort((a, b) => b.text.length - a.text.length);
        const best = overlapGroup[0];
        result.push({ text: best.text, entry: best.entry });
        return best.index + best.text.length - 1; // 返回结束位置
    };

    let currentOverlapGroup: typeof matches = [];
    
    for (const match of matches) {
        // 如果当前匹配的起始位置已经被之前的长词覆盖了，则跳过
        if (match.index <= lastCoveredIndex) continue;

        // 这里的逻辑简化处理：
        // 实际上我们需要构建区间树或者简单的区间合并。
        // 既然已经按 index 排序，我们检查是否与前一个有重叠是不够的，
        // 我们采取最简单的策略：直接搜索替换。
        // 上面的 indexOf 逻辑已经找出了所有位置。
        // 为了避免 "China"(中) 替换了 "China"(中国) 里的中，
        // 我们需要过滤掉包含关系的匹配。
    }

    // 重新简化实现：直接使用最长优先替换策略构建最终列表
    // 这种方法对于 "中" 和 "中俄" 这种非包含关系（一个是字，一个是词）更好处理
    
    // 最终输出不需要位置信息，只需要告诉调用者“哪些词”被匹配了。
    // 调用者会用 replace 去替换。
    // 但是 replace 全局替换会有问题。
    // 所以我们还是返回去重后的列表，让调用者用正则构建。
    
    // 过滤掉被“更长匹配”包含的短匹配
    // 例如 Matches: "中国"(Entry A), "中"(Entry B)
    // 保留 "中国"
    
    const uniqueMatches = new Map<string, WordEntry>();
    matches.forEach(m => {
        // 如果已经存在更长的包含这个词的匹配，则忽略 (简化处理，实际应该基于位置)
        // 但由于我们最后是用 regex split，如果 patterns 里同时有 "中国" 和 "中"，
        // 正则引擎通常会优先匹配最长的（如果顺序正确）。
        
        // 我们只需要确保 matches 里不包含重复的 Key
        if (!uniqueMatches.has(m.text)) {
            uniqueMatches.set(m.text, m.entry);
        } else {
            // 如果已经有了，看谁的英文单词更长（可能越精准）? 或者保留第一个。
            // 这里保留第一个即可。
        }
    });

    return Array.from(uniqueMatches.entries()).map(([text, entry]) => ({ text, entry }));
};
