import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY;

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export async function sendChatMessage(
    messages: Message[],
    onStream?: (chunk: string) => void
): Promise<string> {
    try {
        console.log('🤖 Sending message to OpenAI...');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages,
                stream: !!onStream,
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to get response from AI');
        }

        if (onStream) {
            // Handle streaming response
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;

                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices[0]?.delta?.content || '';
                                if (content) {
                                    fullResponse += content;
                                    onStream(content);
                                }
                            } catch (e) {
                                // Skip invalid JSON
                            }
                        }
                    }
                }
            }

            return fullResponse;
        } else {
            // Handle non-streaming response
            const data = await response.json();
            const content = data.choices[0]?.message?.content || '';
            console.log('✅ Got response from OpenAI');
            return content;
        }
    } catch (error: any) {
        console.error('❌ Error calling OpenAI:', error);
        throw error;
    }
}

export function createSystemPrompt(userName?: string, userLocation?: string): string {
    return `You are a helpful travel assistant for the Traverse app. You help users plan trips, discover destinations, and make the most of their travels.

${userName ? `User's Name: ${userName}` : ''}
${userLocation ? `User's Location: ${userLocation}` : ''}

Be friendly, concise, and actionable. Provide specific recommendations with approximate prices when possible. Keep responses under 150 words unless the user asks for detailed information.

Focus on:
- Destination recommendations
- Itinerary planning
- Budget estimates
- Best times to visit
- Local tips and cultural insights
- Activity suggestions
- Safety information`;
}
