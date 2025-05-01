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

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const validateSession = async () => {
        try {
            const res = await fetch('http://localhost:8080/auth/session', {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                if (!data.email) {
                    setUser(null);
                    return;
                } else {
                    console.log('Session data:', data);
                    setUser(data.email);
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
        await fetch('http://localhost:8080/auth/logout', { method: 'POST', credentials: 'include' });
        setUser(null);
        setOpen(false);
    };

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
                    <Link href='/scoredle'>Scoredle</Link>
                </li>
                <li>
                    <Link href='/connections'>Connections</Link>
                </li>
                <li>
                    <Link href='/trivia'>Trivia</Link>
                </li>
            </ul>
            <div>
                {user ? (
                    <>
                        <Avatar
                            ref={anchorRef}
                            onClick={() => setOpen((prev) => !prev)}
                            sx={{
                                cursor: 'pointer',
                                backgroundImage: generateGradient(user),
                                color: 'white',
                                width: 40,
                                height: 40,
                                fontSize: '1rem',
                                backgroundSize: 'cover',
                            }}
                        >
                            {user?.[0]?.toUpperCase() || '?'}
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
                            }}>
                        Login
                    </Button>
                )}
            </div>
        </nav>
    );
}
