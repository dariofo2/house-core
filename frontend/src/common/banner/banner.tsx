// @ontend/src/common/UserBanner.tsx
// No 'use client' directive means this is a Server Component

import { cookies } from 'next/headers';
import Link from 'next/link';
import React from 'react';
import { RoleName } from '../enum/role.enum';

// Define the expected structure of the parsed user cookie's JSON value
interface UserCookieData {
    name: string;
    userRoles?: {
        role: {
            name: string;
        };
    }[];
}

export default async function UserBanner() {
    let userName: string | null = null;
    let isAdmin: boolean = false;

    try {
        // Access cookies from the server component
        const userCookie = (await cookies()).get('user');

        if (userCookie && userCookie.value) {
            // Attempt to parse the cookie value as JSON
            const parsedCookieValue = JSON.parse(userCookie.value) as UserCookieData;

            // Check if the parsed object is valid and has a 'name' property
            if (parsedCookieValue && typeof parsedCookieValue.name === 'string') {
                userName = parsedCookieValue.name;
            }

            // Check if the user has the ADMIN role
            isAdmin = parsedCookieValue.userRoles?.some(ur => ur.role.name === RoleName.ADMIN) || false;
        }
    } catch (error) {
        console.error('Failed to parse user cookie for banner:', error);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
            <div className="container">
                <Link href="/" className="navbar-brand fw-bold">
                    House Core
                </Link>
                <div className="navbar-nav ms-auto align-items-center">
                    {userName ? (
                        <>
                            {isAdmin && (
                                <Link href="/admin" className="btn btn-warning btn-sm me-3 fw-bold">
                                    <i className="bi bi-shield-lock-fill me-1"></i>
                                    Admin Panel
                                </Link>
                            )}
                            <span className="navbar-text text-white me-3">
                                <i className="bi bi-person-circle me-1"></i>
                                Bienvenido, <strong>{userName}</strong>
                            </span>
                            <Link href="/logout" className="btn btn-outline-light btn-sm">
                                Cerrar Sesión
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="nav-link text-white me-2">
                                Login
                            </Link>
                            <Link href="/register" className="btn btn-light btn-sm fw-bold">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
