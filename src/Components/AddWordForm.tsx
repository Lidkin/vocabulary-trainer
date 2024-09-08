import React, { useState } from 'react'


type Props = {
    onAddWord: (english: string, russian: string, pronunciation: string) => void;
}
function AddWordForm({ onAddWord }: Props) {
    const [english, setEnglish] = useState('');
    const [russian, setRussian] = useState('');
    const [pronunciation, setPronunciation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddWord(english, russian, pronunciation);
        setEnglish('');
        setRussian('');
        setPronunciation('');


    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>English Word / Phrase</label>
                <input
                    type="text"
                    value={english}
                    onChange={(e) => setEnglish(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Russian Translation</label>
                <input
                    type="text"
                    value={russian}
                    onChange={(e) => setRussian(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Pronunciation</label>
                <input
                    type="text"
                    value={pronunciation}
                    onChange={(e) => setPronunciation(e.target.value)}
                    required
                />
            </div>
            <button type='submit'>Add Word</button>
        </form>
    )
}

export default AddWordForm
