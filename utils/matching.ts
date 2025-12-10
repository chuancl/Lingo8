
import { WordEntry } from "../types";

/**
 * 计算两个字符串的字符重叠相似度 (基于 Dice Coefficient 的简化版)
 * 用于衡量 分词片段(segment) 与 词典释义(definition) 的对齐程度
 */
const calculateSimilarity = (segment: string, definition: string): number => {
    if (!segment || !definition) return 0;
    
    // 1. 完全精确匹配，最高分
    if (segment === definition) return 1.0;

    // 2. 单字安全检查 (Single Character Safety)
    // 如果分词是单字，必须完全匹配。避免 "中国" 匹配到 "中"，"我们" 匹配到 "我"
    if (segment.length === 1 || definition.length === 1) {
        return segment === definition ? 1.0 : 0;
    }

    // 3. 计算字符重叠度 (Set Intersection)
    const segChars = new Set(segment.split(''));
    const defChars = new Set(definition.split(''));
    
    let intersectionCount = 0;
    segChars.forEach(char => {
        if (defChars.has(char)) intersectionCount++;
    });

    // 使用 Dice Coefficient: 2 * intersection / (len1 + len2)
    // 这种算法对长度差异敏感，能有效防止短词匹配到长词的一部分
    return (2.0 * intersectionCount) / (segment.length + definition.length);
};

/**
 * 核心匹配逻辑：在中文源文本中寻找可以被替换的单词
 * 
 * 优化点：
 * 1. 使用 Intl.Segmenter 进行语义分词，而非简单的字符串查找。
 * 2. 引入“词向量对齐”思想的简化版 -> 字符重叠相似度评分。
 * 3. 增加阈值过滤，减少误杀。
 */
export const findFuzzyMatches = (sourceText: string, candidates: WordEntry[]): { text: string, entry: WordEntry }[] => {
    // 使用浏览器原生的 Intl.Segmenter 进行中文分词 (Granularity: 'word')
    // 这能确保我们不会把 "在本文中" 错误地拆解，"中" 会被识别为方位词或后缀，而 "中国" 是专有名词
    const segmenter = new (Intl as any).Segmenter('zh-CN', { granularity: 'word' });
    const segments = Array.from((segmenter as any).segment(sourceText)).map((s: any) => s.segment as string);
    
    // 去重，减少计算量
    const uniqueSegments = [...new Set(segments)]; 

    const matches: { text: string, entry: WordEntry }[] = [];

    // 最小匹配阈值 (0.0 - 1.0)
    // 例如: "美丽的" (3) vs "美丽" (2) -> Dice = 4/5 = 0.8 (Pass)
    // 例如: "中国" (2) vs "中" (1) -> 单字规则直接拒绝 (0.0)
    // 例如: "银行" (2) vs "很行" (2) -> Overlap 1 -> Dice = 2/4 = 0.5 (Fail)
    const SIMILARITY_THRESHOLD = 0.65;

    for (const seg of uniqueSegments) {
        // 跳过非中文字符 (标点、空格、纯数字)
        if (!/[\u4e00-\u9fa5]/.test(seg)) continue;

        let bestMatch: WordEntry | null = null;
        let bestScore = 0;

        for (const entry of candidates) {
            // 必须有中文释义才能进行对齐
            if (!entry.translation) continue;
            
            // 清理释义中的常见分隔符，取第一个主要释义进行比对 (简单处理)
            // 比如 "银行; 岸" -> "银行"
            const primaryTrans = entry.translation.split(/[,;，；]/)[0].trim();
            
            const score = calculateSimilarity(seg, primaryTrans);

            // 只有超过阈值才考虑
            if (score >= SIMILARITY_THRESHOLD) {
                // 如果分数更高，或者分数相同但英文单词更长(通常更具体)，则更新最佳匹配
                if (score > bestScore || (score === bestScore && entry.text.length > (bestMatch?.text.length || 0))) {
                    bestScore = score;
                    bestMatch = entry;
                }
            }
        }

        if (bestMatch) {
            matches.push({ text: seg, entry: bestMatch });
        }
    }
    
    return matches;
};
