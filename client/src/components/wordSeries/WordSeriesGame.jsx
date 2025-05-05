import React, { useState, useEffect } from 'react';
import '../../styles/wordSeries.css';
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Grid from './Grid';
import AttemptsIndicator from './AttemptsIndicator';
import DiscoveredGroups from './DiscoveredGroups';

export default function WordSeriesGame() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [discoveredGroups, setDiscoveredGroups] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);
    const [attempts, setAttempts] = useState(4);
    const [showError, setShowError] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);

    useEffect(() => {
        const fetchWordSeriesGroups = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/wordseries/get-words');
                const data = await res.json();

                if (data.groups) {
                    setGroups(data.groups);
                    const combinedPlayers = data.groups
                        .flatMap((group) => group.players.map(name => ({
                            id: `${group.category}-${name}`,
                            name,
                            category: group.category
                        })));
                    setPlayers(shuffle(combinedPlayers));
                }


            } catch (err) {
                console.error('Error fetching word series groups:', err);
            }
        };

        fetchWordSeriesGroups();
    }, []);

    const handlePlayerClick = (player) => {
        if (discoveredGroups.some(group => group.players.some(p => p.id === player.id))) {
            return;
        }

        const isAlreadySelected = selectedPlayers.some(p => p.id === player.id);

        if (isAlreadySelected) {
            setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
        } else if (selectedPlayers.length < 4) {
            setSelectedPlayers(prev => [...prev, player]);
        }
    };

    const validate_groupings = (selectedPlayers) => {
        if (selectedPlayers.length !== 4) return false;

        const firstCategory = selectedPlayers[0].category;

        return selectedPlayers.every(player => player.category === firstCategory);
    };

    const handleSubmit = () => {
        if (selectedPlayers.length !== 4) return;

        const isValid = validate_groupings(selectedPlayers);

        if (isValid) {
            const groupType = mapCategoryToType(selectedPlayers[0].category);
            const categoryName = selectedPlayers[0].category;

            const groupDescription = groups.find(g => g.category === categoryName)?.category || categoryName;

            setDiscoveredGroups(prev => [...prev, {
                players: selectedPlayers,
                type: groupType,
                description: categoryName
            }]);

            setPlayers(prev => prev.filter(player =>
                !selectedPlayers.some(p => p.id === player.id)
            ));

            setSelectedPlayers([]);

            if (discoveredGroups.length + 1 >= groups.length) {
                setTimeout(() => {
                    setShowCongrats(true);
                }, 500);
            }
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

    const mapCategoryToType = (category) => {

        const categoryLower = category.toLowerCase();

        if (categoryLower.includes('basemen') ||
            categoryLower.includes('shortstop') ||
            categoryLower.includes('outfielder') ||
            categoryLower.includes('pitcher') ||
            categoryLower.includes('catcher')) {
            return 'position';
        }

        if (categoryLower.includes('yankees') ||
            categoryLower.includes('red sox') ||
            categoryLower.includes('dodgers') ||
            categoryLower.includes('giants') ||
            categoryLower.includes('cardinals') ||
            categoryLower.includes('cubs') ||
            categoryLower.includes('athletics') ||
            categoryLower.includes('braves')) {
            return 'team';
        }

        if (categoryLower.includes('hall of fame') ||
            categoryLower.includes('mvp winners') ||
            categoryLower.includes('all star players')) {
            return 'award';
        }

        //Default return
        return 'era';
    };

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    const handleReset = () => {
        window.location.reload();
    }

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

            {discoveredGroups.length > 0 && (
                <DiscoveredGroups groups={discoveredGroups} />
            )}

            <Grid
                players={players}
                selectedPlayers={selectedPlayers}
                onPlayerClick={handlePlayerClick}
                showError={showError}
            />

            <AttemptsIndicator attempts={attempts} />

            <div className="wordseries-button-area">
                <button className="wordseries-submit-button" onClick={handleSubmit} disabled={selectedPlayers.length !== 4}>Submit</button>
                <button className="wordseries-shuffle-button" onClick={() => setPlayers(shuffle([...players]))}>Shuffle</button>
            </div>

            {showGameOver && (
                <div className="wordseries-gameover-overlay">
                    <div className="wordseries-gameover-box">
                        <h2>Game Over</h2>
                        <p>No more attempts left!</p>
                        <button onClick={handleReset}>Play Again</button>
                    </div>
                </div>
            )}

            {showCongrats && (
                <div className="wordseries-overlay">
                    <div className="wordseries-dialog-box">
                        <h2>🎉 Congratulations!</h2>
                        <p>You found all the groups!</p>
                        <button className="wordseries-replay-button" onClick={handleReset}>Play Again</button>
                    </div>
                </div>
            )}

        </div>
    );
}
