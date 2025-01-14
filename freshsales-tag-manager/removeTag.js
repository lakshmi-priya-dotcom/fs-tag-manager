const axios = require('axios');

const freshsalesApiToken = 'utuDLqIN_mLX225l6F0Teg';
const freshsalesDomain = 'lakshmipriya-test.myfreshworks.com'; 
const contactId = '402028650053'; // Replace with the contact ID you want to modify
const tagToRemove = 'Likely to buy';

const headers = {
    'Authorization': `Token token=${freshsalesApiToken}`,
    'Content-Type': 'application/json',
};

async function removeTag() {
  try {
    // Step 1: Fetch contact details
    const contactResponse = await axios.get(
      `https://${freshsalesDomain}/crm/sales/api/contacts/${contactId}`,
      { headers }
    );
    const contact = contactResponse.data.contact;
    const tags = contact.tags;

    // Step 2: Modify the tags array
    const updatedTags = tags.filter(tag => tag !== tagToRemove);

    // Step 3: Update the contact with modified tags
    const updateResponse = await axios.patch(
      `https://${freshsalesDomain}/crm/sales/api/contacts/${contactId}`,
      { tags: updatedTags },
      { headers }
    );

    console.log('Updated contact tags:', updateResponse.data.contact.tags);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

removeTag();