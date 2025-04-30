import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        const url = `${process.env.BACKEND_URL}/api/auth/login`;
        console.log('Request URL:', url);
        // Forward to backend API
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            const res = NextResponse.json(data);
            res.cookies.set('token', data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600 // 1 hour
            });
            return res;
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { status: 0, message: 'Authentication failed' },
            { status: 500 }
        );
    }
}