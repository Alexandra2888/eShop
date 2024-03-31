import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import Button from "../components/Button";

const TypingIndicator = ({ content }) => {
  return (
    <div className="flex items-center justify-start mb-2 pl-2">
      <div className="animate-ping h-2 w-2 bg-gray-400 rounded-full mr-1"></div>
      <div className="animate-ping h-2 w-2 bg-gray-400 rounded-full mr-1"></div>
      <div className="animate-ping h-2 w-2 bg-gray-400 rounded-full"></div>
      <span className="ml-2 text-sm text-gray-600">{content}</span>
    </div>
  );
};

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');

    const [messages, setMessages] = useState([
      {
        message: "Hello, I'm Kate! How can I assist you with your IT shopping today?",
        sentTime: new Date().toISOString(),
        sender: "Kate",
      },
    ]);
    
    const [isTyping, setIsTyping] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (e) => {
        e.preventDefault(); 
        const userMessage = { text: input, user: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const botResponse = await fetchMessage(input);
            setMessages((prevMessages) => [...prevMessages, { text: botResponse, user: 'bot' }]);
        } catch (error) {
            console.error("Fetch message error:", error);
            setMessages((prevMessages) => [...prevMessages, { text: `Error: ${error.message}`, user: 'bot' }]);
        }

        setInput(''); 
    };

  
    const fetchMessage = async (input) => {
      const userMessage = {
        message: input,
        sentTime: new Date().toISOString(),
        sender: "user",
      };
    
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setIsTyping(true);
    
      try {
        const response = await processMessageToKate([...messages, userMessage]);
        const content = response.choices[0]?.message?.content;
    
        if (content) {
          const kateResponse = {
            message: content,
            sentTime: new Date().toISOString(),
            sender: "Kate",
          };
    
          setMessages((prevMessages) => [...prevMessages, kateResponse]);
        }
      } catch (error) {
        console.error("Error fetching message:", error);
      } finally {
        setIsTyping(false);
      }
    };
    
    async function processMessageToKate(chatMessages) {
      const apiMessages = chatMessages.map((msg) => ({
        role: msg.sender === "Kate" ? "assistant" : "user",
        content: msg.message,
      }));
    
      const apiRequestBody = {
        model: "gpt-3.5-turbo", 
        messages: apiMessages,
        organization:"org-hJo06jGhybEYp7XizITS1ltd"
      };
    
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });
    
      return response.json();
    }
  

    return (
      <div className="fixed bottom-6 right-12 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white p-4 rounded-lg shadow max-w-xs w-full">
          <div className="message-container h-40 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`message mb-2 p-2 rounded-md text-black ${message.sender === 'user' ? 'bg-gray-200' : 'bg-gray-300'}`}>
                {message.message}
              </div>
            ))}
            {isTyping && <TypingIndicator content="Kate is typing..." />}
          </div>
          <form onSubmit={sendMessage} className="mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-1 rounded w-full"
              placeholder="Type a message..."
            />
          </form>
        </div>
      )}
      <Button onClick={toggleChat} className="text-3xl p-2 bg-pink-600 py-2 px-4 hover:bg-pink-700 text-white rounded-full">
        <FiMessageCircle />
      </Button>
    </div>
    );
}

export default ChatWidget;
