import { onRequest } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';

admin.initializeApp();

// ----------------------------------------------------------------------
// TICKET MAPPING DICTIONARY
// Replace the "ID_..." placeholders when you have the real IDs.
// ----------------------------------------------------------------------
const TICKET_MAP = {
  // Test IDs
  62421: 'berletCount',
  62419: 'pentekJegyCount',

  // Bérletek
  ID_EARLY_BIRD_BERLET: 'berletCount',
  ID_NORMAL_BERLET: 'berletCount',

  // Péntek
  ID_EARLY_BIRD_PENTEK: 'pentekJegyCount',
  ID_NORMAL_PENTEK: 'pentekJegyCount',

  // Szombat
  ID_EARLY_BIRD_SZOMBAT: 'szombatJegyCount',
  ID_NORMAL_SZOMBAT: 'szombatJegyCount',

  // Vasárnap
  ID_EARLY_BIRD_VASARNAP: 'vasarnapJegyCount',
  ID_NORMAL_VASARNAP: 'vasarnapJegyCount',
};

export const catchTicketSale = onRequest(async (req, res) => {
  const emailBody = req.body.emailBody;

  if (!emailBody) {
    return res.status(400).send('No email body provided.');
  }

  // Regex to find the ID and the quantity next to the "x"
  const regex = /\((\d+)\)\s*[\d\s]+(?:HUF|Ft)\s*(\d+)x/gi;

  let match;

  const localTotals = {};

  while ((match = regex.exec(emailBody)) !== null) {
    const ticketId = match[1];
    const quantity = parseInt(match[2], 10);

    const dbField = TICKET_MAP[ticketId];

    if (dbField) {
      localTotals[dbField] = (localTotals[dbField] || 0) + quantity;
      console.log(`Found ticket ID: ${ticketId}, Adding: ${quantity} to ${dbField}`);
    } else {
      console.log(`Warning: Found ID (${ticketId}) but it is not in the TICKET_MAP!`);
    }
  }

  // If the email didn't contain any recognized tickets, stop here
  if (Object.keys(localTotals).length === 0) {
    return res.status(200).send('Ignored: No recognized ticket IDs found.');
  }

  const rtdbUpdates = {};
  for (const [field, totalQty] of Object.entries(localTotals)) {
    rtdbUpdates[field] = admin.database.ServerValue.increment(totalQty);
  }

  try {
    const dbRef = admin.database().ref('Jegyek');

    await dbRef.update(rtdbUpdates);

    res.status(200).send('Realtime Database updated successfully!');
  } catch (error) {
    console.error('Database update failed:', error);
    res.status(500).send('Internal Server Error');
  }
});
