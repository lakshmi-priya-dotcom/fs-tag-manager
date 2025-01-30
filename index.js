const axios = require('axios'); // Import axios for API requests
const http = require('http'); // Import HTTP module to create a server

// API endpoint and token
const BASE_API_URL = 'https://lakshmipriya-test.myfreshworks.com/crm/sales/api';
const HEADERS = { 
  Authorization: 'Token token=utuDLqIN_mLX225l6F0Teg',
  'Content-Type': 'application/json',
};

// API URLs
const UPDATE_CONTACT_URL = `${BASE_API_URL}/contacts/`;
const UPDATE_ACCOUNT_URL = `${BASE_API_URL}/sales_accounts/`;
const UPDATE_DEAL_URL = `${BASE_API_URL}/deals/`;

// Function to fetch and modify contacts
async function fetchAndModifyContacts() {
  let page = 1;
  const maxPages = 20; // Maximum pages to fetch
  let modifiedContacts = [];

  while (page <= maxPages) {
    try {
      const response = await axios.get(`${BASE_API_URL}/contacts/view/402004204354?per_page=25&sort=name&sort_type=asc&page=${page}`, { headers: HEADERS });
      const contacts = response.data.contacts || [];

      if (contacts.length === 0) {
        console.log(`No contacts found on page ${page}`);
        break;
      }

      const pageModifiedContacts = contacts.map(contact => {
        if (contact.tags && contact.tags.includes('test tag for list')) {
          contact.tags = contact.tags.filter(tag => tag !== 'test tag for list');
          updateContactInCRM(contact); // Update the contact in CRM
        }
        return contact;
      });

      modifiedContacts = [...modifiedContacts, ...pageModifiedContacts];
      console.log(`Processed page ${page}`);
      page++;
    } catch (error) {
      console.error(`Error fetching contacts on page ${page}:`, error.message);
      break;
    }
  }
  return modifiedContacts;
}

// Function to update a contact in CRM
async function updateContactInCRM(contact) {
  try {
    const contactId = contact.id;
    const updatedData = { contact: { ...contact, tags: contact.tags } };

    await axios.put(`${UPDATE_CONTACT_URL}${contactId}`, updatedData, { headers: HEADERS });
    console.log(`Successfully updated contact ${contactId}`);
  } catch (error) {
    console.error(`Error updating contact ${contact.id}:`, error.message);
  }
}

// Function to fetch and modify accounts
async function fetchAndModifyAccounts() {
  let page = 1;
  const maxPages = 20; // Maximum pages to fetch
  let modifiedAccounts = [];

  while (page <= maxPages) {
    try {
      const response = await axios.get(`${BASE_API_URL}/sales_accounts/view/402004204381?per_page=25&sort=name&sort_type=asc&page=${page}`, { headers: HEADERS });
      const accounts = response.data.sales_accounts || [];

      if (accounts.length === 0) {
        console.log(`No accounts found on page ${page}`);
        break;
      }

      const pageModifiedAccounts = accounts.map(account => {
        if (account.tags && account.tags.includes('test tag for list')) {
          account.tags = account.tags.filter(tag => tag !== 'test tag for list');
          updateAccountInCRM(account); // Update the account in CRM
        }
        return account;
      });

      modifiedAccounts = [...modifiedAccounts, ...pageModifiedAccounts];
      console.log(`Processed page ${page}`);
      page++;
    } catch (error) {
      console.error(`Error fetching accounts on page ${page}:`, error.message);
      break;
    }
  }
  return modifiedAccounts;
}

// Function to update an account in CRM
async function updateAccountInCRM(account) {
  try {
    const accountId = account.id;
    const updatedData = { sales_account: { ...account, tags: account.tags } };

    await axios.put(`${UPDATE_ACCOUNT_URL}${accountId}`, updatedData, { headers: HEADERS });
    console.log(`Successfully updated account ${accountId}`);
  } catch (error) {
    console.error(`Error updating account ${account.id}:`, error.message);
  }
}

// Function to fetch and modify deals
async function fetchAndModifyDeals() {
  let page = 1;
  const maxPages = 20; // Maximum pages to fetch
  let modifiedDeals = [];

  while (page <= maxPages) {
    try {
      const response = await axios.get(`${BASE_API_URL}/deals/view/402004204366?per_page=25&sort=name&sort_type=asc&page=${page}`, { headers: HEADERS });
      const deals = response.data.deals || [];

      if (deals.length === 0) {
        console.log(`No deals found on page ${page}`);
        break;
      }

      const pageModifiedDeals = deals.map(deal => {
        if (deal.tags && deal.tags.includes('test tag for list')) {
          deal.tags = deal.tags.filter(tag => tag !== 'test tag for list');
          updateDealInCRM(deal); // Update the deal in CRM
        }
        return deal;
      });

      modifiedDeals = [...modifiedDeals, ...pageModifiedDeals];
      console.log(`Processed page ${page}`);
      page++;
    } catch (error) {
      console.error(`Error fetching deals on page ${page}:`, error.message);
      break;
    }
  }
  return modifiedDeals;
}

// Function to update a deal in CRM
async function updateDealInCRM(deal) {
  try {
    const dealId = deal.id;
    const updatedData = { deal: { ...deal, tags: deal.tags } };

    await axios.put(`${UPDATE_DEAL_URL}${dealId}`, updatedData, { headers: HEADERS });
    console.log(`Successfully updated deal ${dealId}`);
  } catch (error) {
    console.error(`Error updating deal ${deal.id}:`, error.message);
  }
}

// Create a local server to display the modified data
const server = http.createServer(async (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    const modifiedContacts = await fetchAndModifyContacts();
    const modifiedAccounts = await fetchAndModifyAccounts();
    const modifiedDeals = await fetchAndModifyDeals();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ contacts: modifiedContacts, accounts: modifiedAccounts, deals: modifiedDeals }, null, 2));
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