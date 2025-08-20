// API endpoint to handle Clerk webhooks
// This will sync user data between Clerk and your database

import { supabase } from '../../src/lib/supabase-server';

// Simple Node.js/Express style handler (no Clerk/Svix verification)
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Expect Clerk event type and data in the body
  const { type, data } = req.body || {};
  if (!type || !data) {
    return res.status(400).json({ error: 'Missing event type or data' });
  }

  switch (type) {
    case 'user.created':
    case 'user.updated':
      await handleUserEvent(data, type);
      break;
    case 'user.deleted':
      await handleUserDeletion(data);
      break;
    default:
      console.log(`Unhandled webhook type: ${type}`);
  }

  res.status(200).json({ received: true });
}

async function handleUserEvent(userData: any, eventType: string) {
  try {
    const userType = userData.public_metadata?.userType || 'client'; // Default to client
    const isLawyer = userType === 'lawyer';

    // Prepare data for your simplified users table
    const userRecord = {
      id: userData.id, // Use Clerk user ID as primary key
      email: userData.email_addresses[0]?.email_address,
      full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      user_type: userType,
      // Lawyer-specific fields
      lsk_number: userData.public_metadata?.lsk_number || null,
      // Client-specific fields  
      company_name: userData.public_metadata?.company_name || null,
      industry: userData.public_metadata?.industry || null,
      updated_at: new Date().toISOString()
    };

    // Use your create_user_profile function or direct insert
    const { data, error } = await supabase
      .from('users')
      .upsert(userRecord, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return;
    }

    console.log(`User ${eventType === 'user.created' ? 'created' : 'updated'}:`, data);

    // Send welcome email for new lawyers
    if (eventType === 'user.created' && isLawyer && userRecord.email) {
      try {
        await fetch(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/send-welcome-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userRecord.email,
            name: userRecord.full_name,
            role: 'lawyer',
            lsk_number: userRecord.lsk_number,
          }),
        });
        console.log('Welcome email sent for new lawyer:', userRecord.email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the webhook if email fails
      }
    }

  } catch (error) {
    console.error('Error handling user event:', error);
  }
}

async function handleUserDeletion(userData: any) {
  try {
    // Delete from your users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userData.id);

    if (error) {
      console.error('Error deleting user:', error);
    } else {
      console.log('User deleted successfully:', userData.id);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}
