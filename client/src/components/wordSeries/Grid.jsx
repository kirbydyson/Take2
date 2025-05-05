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