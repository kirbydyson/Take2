import React from 'react';

export default function Grid({
    players,
    selectedPlayers,
    discoveredGroups,
    onPlayerClick,
    showError,
}) {
    const getPlayerGroupColor = (player) => {
        for (const group of discoveredGroups) {
            if (group.players.some((p) => p.id === player.id)) {
                switch (group.type) {
                    case 'team': return 'wordseries-yellow';
                    case 'position': return 'wordseries-green';
                    case 'era': return 'wordseries-blue';
                    case 'award': return 'wordseries-purple';
                }
            }
        }
        return '';
    };

    const isSelected = (player) => {
        return selectedPlayers.some((p) => p.id === player.id);
    };

    return (
        <div className="wordseries-grid">
            {players.map((player) => {
                const groupColor = getPlayerGroupColor(player);
                const selected = isSelected(player);
                const isInDiscoveredGroup = groupColor !== '';
                const isInvalid = selected && showError;

                let cellClass = 'wordseries-player-cell';
                if (groupColor) cellClass += ` ${groupColor}`;
                if (selected) cellClass += ' wordseries-selected';
                if (isInvalid) cellClass += ' wordseries-invalid';

                return (
                    <button
                        key={player.id}
                        className={cellClass}
                        onClick={() => onPlayerClick(player)}
                        disabled={isInDiscoveredGroup}
                    >
                        {player.name}
                    </button>
                );
            })}
        </div>
    );
}
