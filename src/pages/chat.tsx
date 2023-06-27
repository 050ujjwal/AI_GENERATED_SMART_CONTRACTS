import { ChatContainer, MainContainer, Message, MessageInput, MessageList, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import styles from '@/styles/Chat.module.css';
import { useEffect, useRef, useState } from "react";
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

type Message = {
    content: string | null;
    sentTime: number;
    sender: string;
    direction: 'incoming' | 'outgoing';
}

const CHAT_USER = "Ujjwal";
const DEFAULT_BEHAVIOR = "General Conversation";
const CONFIGURATION = new Configuration({
    apiKey: "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"
})
const OPENAI_CLIENT = new OpenAIApi(CONFIGURATION);

export default function Chat() {
    const messageInput = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [behaviorInput, setBehaviorInput] = useState(DEFAULT_BEHAVIOR);
    const [behavior, setBehavior] = useState(DEFAULT_BEHAVIOR);

    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [rateLimited, setRateLimited] = useState(false);

    useEffect(() => {
        if (!waitingForResponse) {
            messageInput.current?.focus();
        }
    }, [waitingForResponse]);

    const sendMessage = async (innerHtml: string, textContent: string, innerText: string, nodes: NodeList) => {
        const newMessageList = [...messages];
        const newMessage: Message = {
            content: textContent,
            sentTime: Math.floor(Date.now() / 1000),
            sender: 'You',
            direction: 'outgoing',
        }
        newMessageList.push(newMessage);
        setMessages([...newMessageList]);

        setWaitingForResponse(true);
        const response = await getResponse(newMessageList);

        const newMessageResponse: Message = {
            content: response?.content,
            sentTime: Math.floor(Date.now() / 1000),
            sender: CHAT_USER,
            direction: 'incoming',
        }

        newMessageList.push(newMessageResponse);
        setMessages([...newMessageList]);
        setWaitingForResponse(false);
    }

    const getResponse = async (newMessageList: Message[]) => {
        const systemMessage = {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: behavior,
        }

        const input = newMessageList.map((message) => {
            return {
                role: message.sender === CHAT_USER ? ChatCompletionRequestMessageRoleEnum.Assistant : ChatCompletionRequestMessageRoleEnum.User,
                content: message.content,
            }
        });

        const response = await OPENAI_CLIENT.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [systemMessage, ...input],
        });
        console.log(response);

        return {
            content: response.data.choices[0].message?.content,
        }

        await new Promise(f => setTimeout(f, 1000));
        return {
            content: `${Math.random()}`,
        }
    }

    const updateBehavior = () => {
        const finalBehavior = behaviorInput.trim().length ? behaviorInput.trim() : DEAFULT_BEHAVIOR;
        setBehavior(finalBehavior);
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer} >
                <input className={styles.input} value={behaviorInput} onChange={e => setBehaviorInput(e.target.value)} />
                <button className={styles.submit} onClick={updateBehavior}>Update Behavior</button>
            </div>
            <div className={styles.chatWrapper}>
                <div className={styles.chatContainer}>
                    <MainContainer>
                        <ChatContainer>
                            <MessageList className={styles.chatMessageList}
                                typingIndicator={waitingForResponse && <TypingIndicator content="Ujjwal is thinking" style={{ background: '#432A74' }} />}>
                                {
                                    messages.map((message) => {
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <Message
                                                model={{
                                                    message: message.content,
                                                    sentTime: `${message.sentTime}`,
                                                    sender: message.sender,
                                                    direction: message.direction,
                                                    position: 'normal',
                                                    type: 'text',
                                                }}
                                            />
                                        )
                                    })
                                }
                            </MessageList>
                            <MessageInput placeholder="Type message here"
                                style={{ background: '#432A74' }}
                                onSend={sendMessage}
                                autoFocus={true}
                                attachButton={false}
                                disabled={waitingForResponse}
                                ref={messageInput}
                            />
                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
        </div>
    )
}