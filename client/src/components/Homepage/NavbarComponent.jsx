/**
 * Navbar
 *
 * This component renders the top navigation bar for the application,
 * including logo, navigation links, and user authentication controls.
 *
 * Main Features:
 *  - Validates user session on mount; redirects if banned
 *  - Displays links to game pages: Scoredle, Word Series, Trivia
 *  - Shows login button for guests and a dynamic avatar for logged-in users
 *  - Avatar opens a Popper menu with options like "My Games", "Logout", and "Admin Page" for admins
 *  - Generates a unique gradient background for the avatar based on the user's email
 *  - Uses Material UI components for avatar, popper, and menu styling
 *  - Responsive to user session state and gracefully handles logout
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/Navbar.module.css';
import { useEffect, useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const router = useRouter();

    const validateSession = async () => {
        try {
            const res = await fetch('http://localhost:8080/auth/session', {
                credentials: 'include',
            });
            const data = await res.json();
            console.log('Session data:', data);
            if (res.ok && data.isBanned === 1) {
                router.push('/banned');
            } else if (res.ok) {
                if (!data.email) {
                    setUser(null);
                    return;
                } else {
                    console.log('Session data:', data);
                    setUser(data);
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            console.log('Error validating session:', err);
        }
    };

    useEffect(() => {
        validateSession();
    }, []);

    const generateGradient = (name) => {
        if (!name) return '#f50057';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color1 = `hsl(${hash % 360}, 70%, 50%)`;
        const color2 = `hsl(${(hash * 3) % 360}, 70%, 60%)`;
        return `linear-gradient(135deg, ${color1}, ${color2})`;
    };

    const handleLogout = async () => {
        await fetch('http://localhost:8080/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
        setOpen(false);
    };

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
        SLF: 'St. Louis Browns (Federal League)',
        KCF: 'Kansas City Packers (Federal League)',
        CHF: 'Chicago Whales (Federal League)',
        PTF: 'Pittsburgh Rebels (Federal League)',
        BRF: 'Brooklyn Tip-Tops (Federal League)',
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

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href='/'>
                    <Image
                        src='/Logo.png'
                        alt='No-Hitter Tracker Logo'
                        width={80}
                        height={80}
                    />
                </Link>
            </div>
            <ul className={styles.navLinks}>
                <li>
                    <Link href='/catalogue'>Catalogue</Link>
                </li>
                <li>
                    <Link href='/scoredle'>Scoredle</Link>
                </li>
                <li>
                    <Link href='/word-series'>Word Series</Link>
                </li>
                <li>
                    <Link href='/trivia'>Trivia</Link>
                </li>
                {user && (
                    <li style={{ minWidth: 220 }}>
                        {user.team ? (
                            <Link href='/team-info'>
                                {teamIdToName[user.team] || user.team}
                            </Link>
                        ) : (
                            <Autocomplete
                                disablePortal
                                options={teamOptions}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Select Team'
                                        size='small'
                                        InputLabelProps={{
                                            sx: {
                                                color: 'white',
                                                fontFamily: 'inherit',
                                                fontWeight: 'inherit',
                                            },
                                        }}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                color: 'white',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline':
                                                {
                                                    border: 'none',
                                                },
                                            '&:hover .MuiOutlinedInput-notchedOutline':
                                                {
                                                    border: 'none',
                                                },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                {
                                                    border: 'none',
                                                },
                                            '& .MuiSvgIcon-root': {
                                                display: 'none',
                                            },
                                        }}
                                    />
                                )}
                                onChange={async (e, newVal) => {
                                    if (!newVal) return;
                                    await fetch(
                                        'http://localhost:8080/api/users/select-team',
                                        {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type':
                                                    'application/json',
                                            },
                                            credentials: 'include',
                                            body: JSON.stringify({
                                                team: newVal.id,
                                            }),
                                        },
                                    );
                                    validateSession();
                                }}
                                size='small'
                                sx={{ minWidth: 200, marginTop: '-8px' }}
                            />
                        )}
                    </li>
                )}
            </ul>
            <div>
                {user ? (
                    <>
                        <Avatar
                            ref={anchorRef}
                            onClick={() => setOpen((prev) => !prev)}
                            sx={{
                                cursor: 'pointer',
                                backgroundImage: generateGradient(user.email),
                                color: 'white',
                                width: 40,
                                height: 40,
                                fontSize: '1rem',
                                backgroundSize: 'cover',
                            }}
                        >
                            {user.email?.[0]?.toUpperCase() || '?'}
                        </Avatar>
                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            placement='bottom-end'
                            disablePortal
                        >
                            <ClickAwayListener
                                onClickAway={() => setOpen(false)}
                            >
                                <Paper>
                                    <MenuList autoFocusItem={open}>
                                        {user.role === 'admin' && (
                                            <MenuItem
                                                onClick={() => {
                                                    setOpen(false);
                                                    router.push('/admin');
                                                }}
                                            >
                                                Admin Page
                                            </MenuItem>
                                        )}
                                        <MenuItem
                                            onClick={() => {
                                                setOpen(false);
                                                window.location.href =
                                                    '/my-games';
                                            }}
                                        >
                                            My Games
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            Logout
                                        </MenuItem>
                                    </MenuList>
                                </Paper>
                            </ClickAwayListener>
                        </Popper>
                    </>
                ) : (
                    <Button
                        variant='contained'
                        href='/login'
                        sx={{
                            padding: '6px 30px',
                            borderRadius: '50px',
                            color: 'black',
                            backgroundColor: 'white',
                            letterSpacing: '1px',
                            fontSize: '1rem',
                            textTransform: 'none',
                            fontWeight: 'bold',
                        }}
                    >
                        Login
                    </Button>
                )}
            </div>
        </nav>
    );
}
