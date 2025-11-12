import type React from "react"
import * as motion from "motion/react-client"
import "./index.css"
import type { VocabularyDecration } from "@/vocabulary"
import { useRef } from "react"

interface CardProps {
    word: VocabularyDecration
    color: string
    i: number,
    getRandomWord: () => void
}

const Card: React.FC<CardProps> = ({ word, color, i, getRandomWord }: CardProps) => {

    // const [showExampleFlag, setShowExampleFlag] = useState(true)

    const boxRef = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)

    const speakWord = (word: string) => {
        const utterance = new SpeechSynthesisUtterance(word)
        utterance.lang = 'en-US'
        window.speechSynthesis.speak(utterance)
    }

    const dragEndCheck = () => {
        const cardBottom = cardRef.current?.getBoundingClientRect().bottom as number
        const cardTop = cardRef.current?.getBoundingClientRect().top as number
        const boxTop = boxRef.current?.getBoundingClientRect().top as number
        const boxBottom = boxRef.current?.getBoundingClientRect().bottom as number
        if (cardBottom < boxTop || cardTop > boxBottom) {
            getRandomWord()
        }
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
                    <div ref={boxRef} className="splash" style={{ background: color }} />
                    <motion.div
                        ref={cardRef}
                        dragElastic={0.8}
                        onDragEnd={dragEndCheck}
                        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        whileDrag={{ scale: 0.9 }}
                        className="card"
                        initial={{ y: 300 }}
                        drag
                        animate={{
                            y: 0,
                            rotate: -10,
                            transition: {
                                type: "spring",
                                bounce: 0.4,
                                duration: 0.8,
                            }
                        }}
                    >
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