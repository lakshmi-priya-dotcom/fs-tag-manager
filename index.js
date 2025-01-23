const axios = require('axios'); // Import axios for API requests
const http = require('http'); // Import HTTP module to create a server

// API endpoint and token
const API_URL = 'https://lakshmipriya-test.myfreshworks.com/crm/sales/api/contacts/view/402004204354?per_page=100&sort=name&sort_type=asc&page=1';
const HEADERS = {
  Authorization: 'Token token=utuDLqIN_mLX225l6F0Teg',
  'Content-Type': 'application/json',
};

// API URL for updating a contact
const UPDATE_CONTACT_URL = 'https://lakshmipriya-test.myfreshworks.com/crm/sales/api/contacts/';

// Function to fetch and modify contacts
async function fetchAndModifyContacts() {
  try {
    // Fetch data from Freshsales API
    const response = await axios.get(API_URL, { headers: HEADERS });
    const contacts = response.data.contacts || [];

    // Filter contacts by tag and remove the "Bulk email sent" tag
    const modifiedContacts = contacts.map(contact => {
      if (contact.tags && contact.tags.includes('Bulk email sent')) {
        // Remove the "Bulk email sent" tag
        contact.tags = contact.tags.filter(tag => tag !== 'Bulk email sent');
        // Now, update the contact in the CRM
        updateContactInCRM(contact);
      }
      return contact;
    });

    return modifiedContacts;
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    return [];
  }
}

// Function to update a contact in CRM
async function updateContactInCRM(contact) {
  try {
    const contactId = contact.id; // The unique ID for the contact
    const updatedData = {
      contact: {
        ...contact,
        tags: contact.tags, // Update the tags
      },
    };

    // Send PUT request to update the contact's tags
    const updateResponse = await axios.put(
      `${UPDATE_CONTACT_URL}${contactId}`,
      updatedData,
      { headers: HEADERS }
    );

    console.log(`Successfully updated contact ${contactId}`);
  } catch (error) {
    console.error(`Error updating contact ${contact.id}:`, error.message);
  }
}

// Create a local server to display the modified contacts
const server = http.createServer(async (req, res) => {
  if (req.url === '/contacts' && req.method === 'GET') {
    const modifiedContacts = await fetchAndModifyContacts();

    // Send modified contacts as JSON response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(modifiedContacts, null, 2));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});