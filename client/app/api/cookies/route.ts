import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		return NextResponse.json({ cookie: cookies.toString() });
	} catch (error) {
		throw error;
	}
}
