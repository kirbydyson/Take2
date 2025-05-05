// WordSeriesGame.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/wordSeries.css';
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Grid from './Grid';
import { validate_groupings } from "../../utils/validate";

export default function WordSeriesGame() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [discoveredGroups, setDiscoveredGroups] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);
    const [attempts, setAttempts] = useState(4);
    const [showError, setShowError] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);

    useEffect(() => {
        const fetchWordSeriesGroups = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/wordseries/get-words');
                const data = await res.json();

                if (data.groups) {
                    setGroups(data.groups);
                    const combinedPlayers = data.groups
                        .flatMap((group) => group.players)
                        .map((name, idx) => ({ id: idx + 1, name }));
                    setPlayers(combinedPlayers);
                }
            } catch (err) {
                console.error('Error fetching word series groups:', err);
            }
        };

        fetchWordSeriesGroups();
    }, []);

    useEffect(() => {
        if (selectedPlayers.length === 4) {
            handleGroupValidation();
        }
    }, [selectedPlayers]);

    const handlePlayerClick = (player) => {
        const isAlreadySelected = selectedPlayers.some(p => p.id === player.id);

        if (isAlreadySelected) {
            setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
        } else if (selectedPlayers.length < 4) {
            setSelectedPlayers(prev => [...prev, player]);
        }
    };

    const handleGroupValidation = () => {
        const isValid = validate_groupings(selectedPlayers, groups);

        if (isValid) {
            setDiscoveredGroups(prev => [...prev, [...selectedPlayers]]);
            setSelectedPlayers([]);
        } else {
            setShowError(true);
            setAttempts(prev => prev - 1);

            setTimeout(() => {
                setShowError(false);
                setSelectedPlayers([]);
            }, 2000);

            if (attempts - 1 === 0) {
                setShowGameOver(true);
            }
        }
    };

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    return (
        <div className="wordseries-container">
            <div className="wordseries-header">
                <h1 className="wordseries-title">MLB WordSeries</h1>
                <IconButton
                    aria-label="instructions"
                    onClick={() => setShowInstructions(true)}
                    className="wordseries-help-button"
                >
                    <HelpOutlineIcon />
                </IconButton>
            </div>

            {showInstructions && (
                <div className="wordseries-message-area">
                    <p className="wordseries-message">🎯 Select 4 players that belong to the same group!</p>
                </div>
            )}

            <Grid
                players={players}
                selectedPlayers={selectedPlayers}
                discoveredGroups={discoveredGroups}
                onPlayerClick={handlePlayerClick}
                showError={showError}
            />

            <div className="wordseries-button-area">
                <button className="wordseries-submit-button" onClick={() => {}}>Submit</button>
                <button className="wordseries-deselect-button" onClick={() => setSelectedPlayers([])}>Deselect</button>
                <button className="wordseries-shuffle-button" onClick={() => setPlayers(shuffle([...players]))}>Shuffle</button>
            </div>

            {discoveredGroups.length > 0 && (
                <div className="wordseries-found-section">
                    <h3>✔️ Discovered Groups:</h3>
                    {discoveredGroups.map((group, index) => (
                        <div key={index} className="wordseries-found-group">
                            {group.map(p => p.name).join(', ')}
                        </div>
                    ))}
                </div>
            )}

            {showGameOver && (
                <div className="wordseries-gameover-overlay">
                    <div className="wordseries-gameover-box">
                        <h2>Game Over</h2>
                        <p>No more attempts left!</p>
                        <button onClick={() => window.location.reload()}>Play Again</button>
                    </div>
                </div>
            )}
        </div>
    );
}
