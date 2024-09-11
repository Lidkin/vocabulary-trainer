import { useState } from 'react'
import AddWordForm from './Components/AddWordForm';
import './App.css'
import WordsList from './Components/WordsList';

export interface Word {
  id: number;
  english: string;
  russian: string;
  pronunciation: string;
  mistackes: number;
}


function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [practiceMode, setPracticeMode] = useState<'pronunciation' | 'translation' | 'writing' | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userImput, setUserInput] = useState('');
  const [message, setMessage] = useState('');


  const selectWord = () => {
    const sortedWords = [...words].sort((a, b) => b.mistackes - a.mistackes);
    console.log("sortedWords: ", sortedWords)
    return sortedWords[Math.floor(Math.random() * sortedWords.length)];
  }

  const startPractice = (mode: 'pronunciation' | 'translation' | 'writing') => {
    setPracticeMode(mode);
    setCurrentWord(selectWord());
    setMessage('');
  }

  const getLabel = (mode: string) => {
    switch (mode) {
      case 'pronunciation':
        return "Pronounce";
      case 'translation':
        return "Translate";
      case 'writing':
        return "Write";
    }
  }

  const handleInput = () => {
    if (!currentWord) return;
    let isCorrect = false;

    if (practiceMode == 'pronunciation' && userImput.toLowerCase() == currentWord.pronunciation) {
      isCorrect = true;
    } else if (practiceMode == 'translation' && userImput.toLowerCase() == currentWord.russian) {
      isCorrect = true;
    } else if (practiceMode == "writing" && userImput.toLowerCase() == currentWord.english) {
      isCorrect = true;
    }

    if (isCorrect) {
      setMessage("Correct!");
      setCurrentWord(selectWord());
    } else {
      setMessage("Incorrect! Try again.");
      setCurrentWord((prev) => prev ? { ...prev, mistackes: prev.mistackes + 1 } : null);
    }
    setUserInput('');
  }

  return (
    <div>
      <h1>Vocabulary Trainer</h1>
      <div>
        <h2>My Words</h2>
        <WordsList words={ words } setWords={ setWords } />
      </div>
      <div>
        <h2>Add a new Word</h2>
        <AddWordForm />
      </div>

      <div>
        <h2>Practice</h2>
        <button onClick={() => startPractice('pronunciation')}>Pronunciation</button>
        <button onClick={() => startPractice('translation')}>Translation</button>
        <button onClick={() => startPractice('writing')}>Writing</button>
      </div>

      {practiceMode && currentWord && (
        <div>
          <h3>{getLabel(practiceMode)} this word:</h3>
          <p>{practiceMode == 'writing' ? currentWord.russian : currentWord.english}</p>
          <input type="text"
            value={userImput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button onClick={handleInput}>Check</button>
          <p>{message}</p>
        </div>
      )}
    </div>
  )
}

export default App
