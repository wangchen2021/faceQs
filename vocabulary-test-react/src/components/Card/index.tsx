import type React from "react"
import * as motion from "motion/react-client"
import type { Variants } from "motion/react"
import "./index.css"
import type { VocabularyDecration } from "@/vocabulary"
interface CardProps {
    word: VocabularyDecration
    color: string
    i: number
}

const cardVariants: Variants = {
    offscreen: {
        y: 300,
    },
    onscreen: {
        y: 50,
        rotate: -10,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
        },
    },
}

const Card: React.FC<CardProps> = ({ word, color, i }: CardProps) => {

    // const [showExampleFlag, setShowExampleFlag] = useState(true)

    const speakWord = (word: string) => {
        const utterance = new SpeechSynthesisUtterance(word)
        utterance.lang = 'en-US'
        window.speechSynthesis.speak(utterance)
    }

    return (
        <>
            <motion.div
                className={`card-container-${i} card-container un-select`}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ amount: 1 }}
            >
                <div className="content">
                    <div className="splash" style={{ background: color }} />
                    <motion.div variants={cardVariants} className="card">
                        <motion.div className="card-word-container">
                            <motion.div whileHover={{ scale: 1.1 }}>{word.word}</motion.div>
                            <motion.div onClick={() => speakWord(word.word)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.2 }} className="speak-icon">🔈</motion.div>
                        </motion.div>
                        <motion.div className="card-footer">
                            <motion.div style={{ color: "red" }} whileHover={{ scale: 1.1 }}>{word.type}</motion.div>
                            <motion.div whileHover={{ scale: 1.1 }}>{word.translation}</motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
            <motion.div whileTap={{ scale: 1.1 }} onClick={() => speakWord(word.exampleSentence ? word.exampleSentence : "")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="example un-select">{word.exampleSentence}</motion.div>
        </>
    )
}

export default Card