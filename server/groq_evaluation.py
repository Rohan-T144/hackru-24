from groq import Groq
import json
from dotenv import load_dotenv
import os 

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
# Initialize the Groq client
groq = Groq(api_key=GROQ_API_KEY)

def evaluate_speech_with_groq(content):
    """
    Sends the user's public speaking content to Groq for evaluation.
    """
    schema = json.dumps([
        {"aspect": "clarity", "score": "integer", "advice": "string"},
        {"aspect": "conciseness", "score": "integer", "advice": "string"},
        {"aspect": "confidence", "score": "integer", "advice": "string"},
        {"aspect": "emotional reach", "score": "integer", "advice": "string"}
    ], indent=2)
    
    response = groq.chat.completions.create(
        model='llama3-8b-8192',
        messages=[
            {
                'role': 'system',
                'content': (
                    "Analyze the provided public speaking content to evaluate four critical aspects: "
                    "clarity, conciseness, confidence, and emotional reach. "
                    "For each aspect, provide a score from 1 to 10 and specific advice for improvement. "
                    "Return a JSON array that matches this schema:\n\n"
                    f"{schema}\n\n"
                    "Definitions:\n"
                    "- Clarity: How understandable the speech is; evaluate word choice and structure.\n"
                    "- Conciseness: How effectively the speaker conveys ideas without unnecessary filler or repetition.\n"
                    "- Confidence: Reflects the speaker's assertiveness and conviction; analyze word choice and tone.\n"
                    "- Emotional Reach: Assess how well the speech connects emotionally with the audience; evaluate language that inspires, persuades, or empathizes.\n\n"
                    "Return only the JSON array as output."
                )
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
