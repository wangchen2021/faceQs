export type WordsType = "n." | "v." | "adj." | "adv." | "pron." | "conj." | "prep." | "interj.";

/**
 * @param word 单词
 * @param type 词性
 * @param translation 翻译
 * @param exampleSentence 例句
 */
export interface VocabularyDecration {
    word: string;
    type: WordsType | WordsType[];
    translation: string | string[];
    exampleSentence?: string;
    rememberDate?: Date;
    failTimes?: number;
    SuccessTimes?: number;
    accuracy?: string;
}

export function addWordsToVocabulary(vocabulary: Vocabulary, wordsDecalarations: VocabularyDecration[]) {
    wordsDecalarations.forEach(declaration => vocabulary.addWord(declaration));
}

/**
 * @description 词汇类
 */
export class Vocabulary {
    words = new Map<string, VocabularyDecration>();
    constructor() { }

    /**
     * 
     * @param declaration 
     */
    addWord(declaration: VocabularyDecration) {
        this.words.set(declaration.word, declaration);
    }

    /**
     * 
     * @param word 
     * @returns 
     */
    getWord(word: string): VocabularyDecration | undefined {
        return this.words.get(word) as VocabularyDecration;
    }

    /**
     * 
     * @param length 随机词数（可选）
     * @returns 
     */
    randomWord(length: number = 1): Set<VocabularyDecration> {
        if (length > this.words.size) {
            return new Set(this.words.values());
        }
        const res = new Set<VocabularyDecration>()
        while (res.size < length) {
            const keys = Array.from(this.words.keys());
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const word = this.words.get(randomKey)
            if (word) {
                res.add(word);
            }
        }
        return res;
    }

    static giveMeFire() {
        return console.log("加油🔥");
    }
}

// const vocabulary = new Vocabulary();

// const wordsParams: VocabularyDecration[] = [
//     {
//         word: "nocturnal",
//         type: "adj.",
//         translation: "夜间的，夜间活动的",
//         exampleSentence: "Owls are nocturnal creatures."
//     },
//     {
//         word: "anatomy",
//         type: "n.",
//         translation: "解剖学，人体结构",
//         exampleSentence: "He studied human anatomy in medical school."
//     },
//     {
//         word: "acoustic",
//         type: ["adj.", "n."],
//         translation: ["声音的，听觉的", "声学", "音质"],
//         exampleSentence: "The concert hall has excellent acoustic properties."
//     },
//     ...interstellarWords
// ]

// addWordsToVocabulary(vocabulary, wordsParams);

// console.log(vocabulary.randomWord());

// Vocabulary.giveMeFire();



