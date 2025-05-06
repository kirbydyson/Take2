'use client';

import { useEffect, useState } from 'react';
import {
    Typography,
    Container,
    CircularProgress,
    Alert,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    TableContainer,
    Button,
    Box,
    Divider
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function TeamInfoComponent() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [teamData, setTeamData] = useState(null);
    const [showSelect, setShowSelect] = useState(false);

    const teamIdToName = {
        SFN: 'San Francisco Giants',
        SDN: 'San Diego Padres',
        HOU: 'Houston Astros',
        PHI: 'Philadelphia Phillies',
        NYA: 'New York Yankees',
        LAA: 'Los Angeles Angels',
        ARI: 'Arizona Diamondbacks',
        DET: 'Detroit Tigers',
        CIN: 'Cincinnati Reds',
        BAL: 'Baltimore Orioles',
        CHA: 'Chicago White Sox',
        CHN: 'Chicago Cubs',
        OAK: 'Oakland Athletics',
        SEA: 'Seattle Mariners',
        MIA: 'Miami Marlins',
        WAS: 'Washington Nationals',
        LAN: 'Los Angeles Dodgers',
        NYN: 'New York Mets',
        MIN: 'Minnesota Twins',
        TBA: 'Tampa Bay Rays',
        COL: 'Colorado Rockies',
        BOS: 'Boston Red Sox',
        FLO: 'Florida Marlins',
        SLN: 'St. Louis Cardinals',
        TEX: 'Texas Rangers',
        ATL: 'Atlanta Braves',
        KCA: 'Kansas City Royals',
        TOR: 'Toronto Blue Jays',
        MIL: 'Milwaukee Brewers',
        CLE: 'Cleveland Guardians',
        PIT: 'Pittsburgh Pirates',
        MON: 'Montreal Expos',
        CAL: 'California Angels',
        ML1: 'Milwaukee Braves',
        BRO: 'Brooklyn Dodgers',
        SLA: 'St. Louis Browns',
        BSN: 'Boston Braves',
        PHA: 'Philadelphia Athletics',
        NY1: 'New York Giants',
        SLF: 'St. Louis Browns (FL)',
        KCF: 'Kansas City Packers (FL)',
        CHF: 'Chicago Whales (FL)',
        PTF: 'Pittsburgh Rebels (FL)',
        BRF: 'Brooklyn Tip-Tops (FL)',
        LS2: 'Louisville Colonels',
        BLN: 'Baltimore Orioles (19th century)',
        CL4: 'Cleveland Spiders',
        RC2: 'Rochester Broncos',
        KC2: 'Kansas City Cowboys',
        CNU: "Cincinnati Kelly's Killers",
        BUF: 'Buffalo Bisons',
        PRO: 'Providence Grays',
        WOR: 'Worcester Ruby Legs',
    };

    const teamOptions = Object.entries(teamIdToName).map(([id, name]) => ({
        id,
        name,
    }));

    const fetchData = async () => {
        try {
            const res = await fetch(
                'http://localhost:8080/api/users/team-no-hitters',
                {
                    credentials: 'include',
                },
            );
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to fetch team data');
            } else {
                setTeamData(data);
            }
        } catch (err) {
            setError('Network error while fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTeamChange = async (teamObj) => {
        if (!teamObj) return;
        try {
            await fetch('http://localhost:8080/api/users/select-team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ team: teamObj.id }),
            });
            window.location.reload();
        } catch (err) {
            alert('Error updating team');
        }
    };

    const renderTable = (title, entries) => (
        <Box sx={{ mb: 4 }}>
            <Typography variant='h5' gutterBottom>
                {title}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Perfect?</TableCell>
                            <TableCell>Game #</TableCell>
                            <TableCell>Team Game #</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.no_hitters_ID}>
                                <TableCell>{entry.Name}</TableCell>
                                <TableCell>{entry.Date}</TableCell>
                                <TableCell>{entry.yearID}</TableCell>
                                <TableCell>
                                    {entry.Prfct === 'Y' ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell>{entry.Gcar ?? '-'}</TableCell>
                                <TableCell>{entry.Gtm ?? '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    if (loading) {
        return (
            <Container sx={{ mt: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 8 }}>
                <Alert severity='error'>{error}</Alert>
            </Container>
        );
    }

    const fullTeamName = teamIdToName[teamData.team] || teamData.team;

    return (
        <Container sx={{ mt: 13, pb: 8 }}>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={2}
                flexWrap='wrap'
                gap={2}
            >
                <Typography variant='h4'>
                    No-Hitters for {fullTeamName}
                </Typography>
                <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='flex-end'
                    ml='auto'
                >
                    <Button
                        variant='outlined'
                        onClick={() => setShowSelect(!showSelect)}
                    >
                        {showSelect ? 'Cancel' : 'Change Team'}
                    </Button>
                    {showSelect && (
                        <Autocomplete
                            disablePortal
                            options={teamOptions}
                            getOptionLabel={(option) => option.name}
                            onChange={(e, val) => handleTeamChange(val)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label='Select Team'
                                    size='small'
                                />
                            )}
                            sx={{ mt: 1, width: 300 }}
                        />
                    )}
                </Box>
            </Box>

            {renderTable('No-Hitters Thrown By the Team', teamData.thrown)}
            <Divider sx={{ my: 4 }} />
            {renderTable('No-Hitters Against the Team', teamData.against)}
        </Container>
    );
}