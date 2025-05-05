/**
 * Grid.jsx
 *
 * This React component renders the grid of player buttons for the MLB WordSeries game.
 * Each button represents a player that can be selected to form a group.
 * Highlights selected players and visually indicates invalid group selections.
 *
 * Features:
 * - Displays a grid layout of player buttons.
 * - Applies styling based on selection and error states.
 * - Handles click events for player selection.
 *
 * Dependencies:
 * - React
 * - CSS class names for styling
 */

import React from 'react';

export default function Grid({
    players,
    selectedPlayers,
    onPlayerClick,
    showError,
}) {
    const isSelected = (player) => {
        return selectedPlayers.some((p) => p.id === player.id);
    };

    return (
        <div className="wordseries-grid">
            {players.map((player) => {
                const selected = isSelected(player);
                const isInvalid = selected && showError;

                let cellClass = 'wordseries-player-cell';
                if (selected) cellClass += ' wordseries-selected';
                if (isInvalid) cellClass += ' wordseries-invalid';

                return (
                    <button
                        key={player.id}
                        className={cellClass}
                        onClick={() => onPlayerClick(player)}
                    >
                        {player.name}
                    </button>
                );
            })}
        </div>
    );
}