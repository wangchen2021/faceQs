import React, { useEffect, useState } from "react"
import "./App.css"
import Card from "./components/Card"
import { addWordsToVocabulary, interstellarWords, Vocabulary, type VocabularyDecration, animalWords } from './vocabulary'
import * as motion from "motion/react-client"
import refreshSvg from "@/assets/refresh.svg"

const cardColors = [
  "linear-gradient(306deg, hsl(20, 100%, 50%), hsl(40, 100%, 50%))",
  "linear-gradient(306deg, hsl(60, 100%, 50%), hsl(90, 100%, 50%))",
  "linear-gradient(306deg, hsl(80, 100%, 50%), hsl(120, 100%, 50%))",
  "linear-gradient(306deg, hsl(100, 100%, 50%), hsl(140, 100%, 50%))",
  "linear-gradient(306deg, hsl(205, 100%, 50%), hsl(245, 100%, 50%))",
  "linear-gradient(306deg, hsl(260, 100%, 50%), hsl(290, 100%, 50%))",
  "linear-gradient(306deg, hsl(290, 100%, 50%), hsl(320, 100%, 50%))"
]

const getColor = (i: number) => {
  return cardColors[i % cardColors.length]
}

const vocabulary = new Vocabulary()

const App: React.FC = () => {
  const [currentWords, setCurrentWords] = useState<VocabularyDecration[]>([])
  const vocabularyDeclarations: VocabularyDecration[] = [
    ...animalWords,
    ...interstellarWords
  ]

  useEffect(() => {
    addWordsToVocabulary(vocabulary, vocabularyDeclarations)
    getRandomWord()
  }, [])

  const getRandomWord = () => {
    const randomWords = vocabulary.randomWord(1)
    setCurrentWords(Array.from(randomWords))
  }

  return (
    <div className="container">
      <motion.button whileTap={{ scale: 1.3, backgroundColor: "rgba(95, 189, 233, 1)" }} whileHover={{ scale: 1.2 }} className="btn" onClick={getRandomWord}>
          <img className="refresh-icon" src={refreshSvg}></img>
      </motion.button>
      <div className="center">
        {currentWords.map((item, i) => (
          <Card i={i} word={item} color={getColor(i)} key={item.word} />
        ))}
      </div>
    </div>
  )
}

export default App