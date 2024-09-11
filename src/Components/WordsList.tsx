import { useState, useEffect } from 'react';
import axios from 'axios';
import { Word } from '../App';

type Props = {
  words: Word[];
  setWords: (value: Word[]) => void;
}

function WordsList({ words, setWords }: Props) {
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/words')
      .then((response) => {
        setWords(response.data.words);
      })
      .catch((error) => {
        console.error('Error fetching words:', error);
      });
  }, []);

  const handleClick = () => {
    setShowList(!showList);
 }

  return (
    <div>
    <button
      onClick={handleClick}
      >{!showList ? "Show List" : "Hide List"}</button>

    { showList &&  <div>
       {words.length >= 1 ?
         <ul>
           {words.map((word) => (
             <li key={word.id}>
               <p>{word.english}</p>
             </li>
           ))}
         </ul>
         : <p>Empty List</p>}
      </div>}
    </div>
  )
}

export default WordsList
