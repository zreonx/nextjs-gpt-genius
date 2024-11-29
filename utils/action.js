'use server';
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateChatResponse = async (chatMessages) => {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: 'you are a helpful assistant' },
        ...chatMessages,
      ],
      model: 'llama3-8b-8192',
    });

    console.log(response);
    return response.choices[0].message;
  } catch (error) {
    return null;
  }
};

export const getExistingTour = async ({ city, country }) => {
  return null;
};

export const generateTourResponse = async ({ city, country }) => {
  const query = `
    Find ${city} in this country ${country}. 
    If this ${city} in this ${country} exists, create a list of things families can do in this ${city}, ${country}. 
    Once you have a list, create a one-day tour. Response should be in the following JSON format:
    {
      "tour": {
        "city": "${city}",
        "country": "${country}",
        "title": "title of the tour",
        "description": "description of the city and tour",
        "stops": ["short paragraph on stop 1", "short paragraph on stop 2", "short paragraph on stop 3"]
      }
    }

    If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country} return {"tour": null}, with no additional characters or do not add any more response or text other than the JSON. Do not add any summary reponse other than JSON.
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'you are a tour guide' },
        {
          role: 'user',
          content: query,
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0,
    });

    console.log(response);
    

    const tourData = JSON.parse(response.choices[0].message.content)

    if(!tourData.tour) {
      return null
    }

    return tourData.tour;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const createNewTour = async (tour) => {
  return null;
};
