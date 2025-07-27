import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from the jobs API running on port 3000
    const response = await fetch('http://localhost:3000/api/jobs', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jobs = await response.json();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
