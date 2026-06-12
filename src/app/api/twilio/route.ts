import { NextResponse } from 'next/server';
import twilio from 'twilio';

const SANDBOX_FROM = 'whatsapp:+14155238886';
const SMS_FROM = '+15674061920';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      accountSid, 
      authToken, 
      channel, // 'WhatsApp' | 'SMS'
      messageType, // 'alert' | 'template'
      numbers, 
      messageBody, 
      contentSid, 
      contentVariables,
      customSmsFrom
    } = body;

    if (!accountSid || !authToken || !numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json({ error: 'Missing required credentials or numbers.' }, { status: 400 });
    }

    const client = twilio(accountSid, authToken);
    const results = [];

    const fromNumber = channel === 'SMS' 
      ? (customSmsFrom || SMS_FROM) 
      : SANDBOX_FROM;

    for (const number of numbers) {
      let success = false;
      let info = '';

      try {
        const toPlain = number.replace('whatsapp:', '').trim();
        const toWa = `whatsapp:${toPlain}`;
        const toFormatted = channel === 'SMS' ? toPlain : toWa;

        if (messageType === 'template') {
          // Send Twilio Content Template
          const payload = {
            to: toFormatted,
            from: fromNumber,
            contentSid: contentSid,
            contentVariables: JSON.stringify(contentVariables),
          };
          
          const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(payload as any).toString(),
          });
          
          const resultBody = await response.json();
          if (response.ok && resultBody.sid) {
            success = true;
            info = resultBody.sid;
          } else {
            info = resultBody.message || resultBody.error_message || JSON.stringify(resultBody);
          }
        } else {
          // Send plain text (SMS) or free-form WhatsApp
          const msg = await client.messages.create({
            body: messageBody,
            from: fromNumber,
            to: toFormatted,
          });
          success = true;
          info = msg.sid;
        }
      } catch (err: any) {
        success = false;
        info = err.message || String(err);
      }

      results.push({ number, success, info });
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
