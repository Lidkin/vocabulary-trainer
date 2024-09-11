import React, { useState } from 'react';
import axios from 'axios';

function AddWordForm() {
    const [newWord, setNewWord] = useState({ english: '', russian: '', pronunciation: '', mistakes: 0 });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewWord({ ...newWord, [name]: value });
    }

    const handleAddWord = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/words', newWord);
            setNewWord({ english: '', russian: '', pronunciation: '', mistakes: 0 })
        } catch (error) {
            console.error('Error adding word:', error);
        }
    };

    return (
        <form onSubmit={handleAddWord}>
            <div>
                <label>English Word / Phrase</label>
                <input
                    type="text"
                    name="english"
                    value={newWord.english}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Russian Translation</label>
                <input
                    type="text"
                    name="russian"
                    value={newWord.russian}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Pronunciation</label>
                <input
                    type="text"
                    name="pronunciation"
                    value={newWord.pronunciation}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type='submit'>Add Word</button>
        </form>
    )
}

export default AddWordForm
