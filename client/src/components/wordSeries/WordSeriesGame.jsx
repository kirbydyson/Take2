import React, { useState, useEffect } from 'react';
import '../../styles/wordSeries.css';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Grid from './Grid';

// TODO: finish the webpage for the game
export default function WordSeriesGame() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [discoveredGroups, setDiscoveredGroups] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        // Test data
        setPlayers([
            { id: 1, name: 'Derek Jeter' },
            { id: 2, name: 'Babe Ruth' },
            { id: 3, name: 'Jackie Robinson' },
            { id: 4, name: 'Ken Griffey Jr.' },
            { id: 5, name: 'Willie Mays' },
            { id: 6, name: 'Mickey Mantle' },
            { id: 7, name: 'Hank Aaron' },
            { id: 8, name: 'Lou Gehrig' },
            { id: 9, name: 'Shohei Ohtani' },
            { id: 10, name: 'Mike Trout' },
            { id: 11, name: 'Clayton Kershaw' },
            { id: 12, name: 'Justin Verlander' },
            { id: 13, name: 'Max Scherzer' },
            { id: 14, name: 'Aaron Judge' },
            { id: 15, name: 'Freddie Freeman' },
            { id: 16, name: 'Ronald Acuña Jr.' },
        ]);
    }, []);

    const handlePlayerClick = (player) => {
        const isAlreadySelected = selectedPlayers.some(
            (p) => p.id === player.id,
        );

        if (isAlreadySelected) {
            setSelectedPlayers((prev) =>
                prev.filter((p) => p.id !== player.id),
            );
        } else if (selectedPlayers.length < 4) {
            setSelectedPlayers((prev) => [...prev, player]);
        }
    };

    return (
        <div className='wordseries-container'>
            <div className='wordseries-header'>
                <h1>MLB WordSeries</h1>
                <IconButton
                    aria-label='instructions'
                    onClick={() => setShowInstructions(true)}
                    className='wordseries-help-button'
                >
                    <HelpOutlineIcon />
                </IconButton>
            </div>

            <div className='wordseries-message-area'>
                {showInstructions && (
                    <p className='wordseries-message'>
                        🎯 Select 4 players that belong to the same group!
                    </p>
                )}
            </div>

            <Grid
                players={players}
                selectedPlayers={selectedPlayers}
                discoveredGroups={discoveredGroups}
                onPlayerClick={handlePlayerClick}
            />
        </div>
    );
}
