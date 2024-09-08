import { Word } from '../App'

type Props = {
  words: Word[];
}

function WordsList({ words }: Props) {
  
  const handleClick = () => {
    return <ul>
      {words.map((word, index) => (
        <li key={index}>
          <p>{word.english}</p>
        </li>
      ))}
    </ul>
  }

  return (
    <button onClick={handleClick}>Show List</button>
  )
}

export default WordsList
