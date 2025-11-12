import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { 
          error: 'RESEND_API_KEY is not configured',
          message: 'Please set RESEND_API_KEY in your .env.local file'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { to } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'Email address (to) is required' },
        { status: 400 }
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    console.log(`📧 Test email: Sending to ${to} from ${fromEmail}`);

    const result = await resend.emails.send({
      from: fromEmail,
      to: to,
      subject: 'Test Email from TinyTalks',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #f97316;">TinyTalks Email Test</h1>
          <p>This is a test email to verify your Resend integration is working correctly.</p>
          <p>If you received this email, your email notification system is configured properly! ✅</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Sent from: ${fromEmail}<br>
            Resend API Key: ${process.env.RESEND_API_KEY ? 'Configured ✅' : 'Missing ❌'}
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully:', result);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Test email sent successfully',
        result 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Test email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}


