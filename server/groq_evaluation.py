from groq import Groq
import json
from config import GROQ_API_KEY

# Initialize the Groq client
groq = Groq(api_key=GROQ_API_KEY)

def evaluate_speech_with_groq(content):
    """
    Sends the user's public speaking content to Groq for evaluation.
    """
    schema = json.dumps([
        {"aspect": "clarity", "score": "integer", "advice": "string"},
        {"aspect": "conciseness", "score": "integer", "advice": "string"}
    ], indent=2)
    
    response = groq.chat.completions.create(
        model='llama3-8b-8192',
        messages=[
            {
                'role': 'system',
                'content': 'Analyze the provided public speaking content and rate it on clarity and conciseness. '
                           f'Return a JSON array matching this schema: {schema}. Only return the JSON object.'
            },
            {
                'role': 'user',
                'content': content[:2000]
            }
        ]
    )

    ans = response.choices[0].message.content.strip()

    # Extract the JSON from the response
    start_idx = ans.find('[')
    end_idx = ans.rfind(']') + 1

    # Convert the extracted JSON string to a Python dictionary
    try:
        evaluation_results = json.loads(ans[start_idx:end_idx])
        return evaluation_results
    except json.JSONDecodeError:
        print("Error parsing the response JSON from Groq.")
        return None
