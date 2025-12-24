import { Client, Databases } from 'appwrite';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const databases = new Databases(client);

    const userDoc = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
      userId
    );

    return NextResponse.json({
      success: true,
      emailVerified: userDoc.emailVerified || false,
      email: userDoc.email,
      exists: true
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      exists: false
    }, { status: 500 });
  }
}