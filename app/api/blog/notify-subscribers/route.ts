import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template for blog post notifications
function createEmailTemplate(postTitle: string, postExcerpt: string, postUrl: string, subscriberName?: string) {
  const greeting = subscriberName ? `Hello ${subscriberName},` : 'Hello,';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Blog Post: ${postTitle}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f97316 0%, #0ea5e9 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">TinyTalks</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">${greeting}</p>
        
        <h2 style="color: #0c4a6e; font-size: 24px; margin-top: 0; margin-bottom: 15px;">New Blog Post: ${postTitle}</h2>
        
        ${postExcerpt ? `
        <p style="font-size: 16px; color: #6b7280; margin-bottom: 25px; line-height: 1.7;">
          ${postExcerpt}
        </p>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${postUrl}" style="display: inline-block; background: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Read Full Article →
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
          You're receiving this email because you subscribed to TinyTalks blog updates.
        </p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog" style="color: #f97316; text-decoration: none;">Visit our blog</a> | 
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}" style="color: #f97316; text-decoration: none;">Visit TinyTalks</a>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          © ${new Date().getFullYear()} TinyTalks. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, postTitle, postSlug, postExcerpt } = body;

    // Validate required fields
    if (!postId || !postTitle || !postSlug) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, postTitle, postSlug' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please set RESEND_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    // Get all active subscribers
    const { data: subscribers, error: subscribersError } = await db.getBlogSubscribers(true);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'No active subscribers to notify',
          count: 0 
        },
        { status: 200 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const postUrl = `${siteUrl}/blog/${postSlug}`;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    console.log(`📧 Starting email notification for ${subscribers.length} subscribers`);
    console.log(`📧 Using from email: ${fromEmail}`);
    console.log(`📧 Post URL: ${postUrl}`);

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber: { email: string; name?: string }) => {
      try {
        const emailHtml = createEmailTemplate(
          postTitle,
          postExcerpt || '',
          postUrl,
          subscriber.name
        );

        console.log(`📧 Attempting to send email to: ${subscriber.email}`);

        const result = await resend.emails.send({
          from: fromEmail,
          to: subscriber.email,
          subject: `New Blog Post: ${postTitle}`,
          html: emailHtml,
        });

        console.log(`✅ Email sent successfully to ${subscriber.email}:`, result);
        return { success: true, email: subscriber.email, result };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorDetails = error instanceof Error ? error.stack : undefined;
        console.error(`❌ Failed to send email to ${subscriber.email}:`, errorMessage);
        console.error(`❌ Error details:`, errorDetails);
        return { 
          success: false, 
          email: subscriber.email, 
          error: errorMessage,
          details: errorDetails
        };
      }
    });

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`📧 Email notification results: ${successful} sent, ${failed} failed`);
    
    if (failed > 0) {
      console.error(`❌ Failed emails:`, results.filter(r => !r.success));
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Emails sent to ${successful} subscribers`,
        count: successful,
        failed: failed,
        total: subscribers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

