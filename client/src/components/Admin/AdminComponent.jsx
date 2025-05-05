'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuUser, setMenuUser] = useState(null);
    const router = useRouter();

    const validateSession = async () => {
        try {
            const res = await fetch('http://localhost:8080/auth/session', {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok && data.isBanned === true) {
                router.push('/banned');
            } else if (res.ok && data.role === 'admin') {
                setUser(data);
            } else {
                router.push('/404');
            }
        } catch (err) {
            router.push('/404');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/users', {
                credentials: 'include',
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await validateSession();
            await fetchUsers();
        };
        init();
    }, []);

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setMenuUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuUser(null);
    };

    const handleBanToggle = async (email, action) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/users/${action}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                },
            );
            if (res.ok) {
                await fetchUsers();
            }
        } catch (err) {
            console.error(`Failed to ${action} user:`, err);
        } finally {
            handleMenuClose();
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ px: 4, py: 6, mt: 6 }}>
            <Typography variant='h4' gutterBottom>
                Admin User Management
            </Typography>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Banned</TableCell>
                                <TableCell align='right'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow
                                    key={user.email}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={async () => {
                                        try {
                                            const res = await fetch(
                                                `http://localhost:8080/api/users/${user.id}/token`,
                                                {
                                                    credentials: 'include',
                                                },
                                            );
                                            const data = await res.json();
                                            if (res.ok && data.token) {
                                                router.push(
                                                    `/admin/view-user/${data.token}`,
                                                );
                                            } else {
                                                console.error(
                                                    'Failed to retrieve token:',
                                                    data.error,
                                                );
                                            }
                                        } catch (err) {
                                            console.error(
                                                'Error fetching token:',
                                                err,
                                            );
                                        }
                                    }}
                                >
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        {user.isBanned ? 'Yes' : 'No'}
                                    </TableCell>
                                    <TableCell align='right'>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMenuOpen(e, user);
                                            }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {menuUser && (
                    <>
                        <MenuItem
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    const res = await fetch(
                                        `http://localhost:8080/api/users/${menuUser.id}/token`,
                                        {
                                            credentials: 'include',
                                        },
                                    );
                                    const data = await res.json();
                                    if (res.ok && data.token) {
                                        router.push(
                                            `/admin/view-user/${data.token}`,
                                        );
                                    } else {
                                        console.error(
                                            'Failed to retrieve token:',
                                            data.error,
                                        );
                                    }
                                } catch (err) {
                                    console.error('Error fetching token:', err);
                                } finally {
                                    handleMenuClose();
                                }
                            }}
                        >
                            View Data
                        </MenuItem>
                        <MenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBanToggle(
                                    menuUser.email,
                                    menuUser.isBanned ? 'unban' : 'ban',
                                );
                            }}
                        >
                            {menuUser.isBanned ? 'Unban User' : 'Ban User'}
                        </MenuItem>
                    </>
                )}
            </Menu>
        </Box>
    );
}
