import { NextResponse } from 'next/server';
import discordConfig from '@/data/discord.json';

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const webhookUrl = discordConfig.webhookUrl;
    
    if (!webhookUrl) {
      console.warn("Discord Webhook URL is missing from discord.json");
      return NextResponse.json(
        { error: 'Server configuration error: Webhook not set.' },
        { status: 500 }
      );
    }

    const discordPayload = {
      embeds: [
        {
          title: "New Portfolio Contact Form Submission",
          color: 9145334, // Purple color
          fields: [
            {
              name: "Name",
              value: name,
              inline: true
            },
            {
              name: "Email",
              value: email,
              inline: true
            },
            {
              name: "Phone",
              value: phone || "Not provided",
              inline: true
            },
            {
              name: "Message",
              value: message
            }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload)
    });

    if (!response.ok) {
      throw new Error(`Discord API responded with status: ${response.status}`);
    }

    return NextResponse.json({ success: true, message: 'Message sent to Discord successfully!' });
  } catch (error) {
    console.error('Error sending message to Discord:', error);
    return NextResponse.json(
      { error: 'Failed to send message.', details: error.message },
      { status: 500 }
    );
  }
}
