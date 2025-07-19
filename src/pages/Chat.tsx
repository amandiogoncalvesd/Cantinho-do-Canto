import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Music, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

interface Message {
  id: number;
  sender: string;
  senderRole: 'student' | 'teacher' | 'parent' | 'admin';
  content: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatRoom {
  id: number;
  name: string;
  lastMessage: string;
  lastActivity: string;
  avatar: string;
  role: 'teacher' | 'parent' | 'admin' | 'student';
  unreadCount: number;
  online: boolean;
}

const Chat = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatRooms: ChatRoom[] = [
    {
      id: 1,
      name: "Prof. Esmael Nelson",
      lastMessage: "Ótimo progresso na última aula!",
      lastActivity: "há 2 min",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      role: 'teacher',
      unreadCount: 2,
      online: true
    },
    {
      id: 2,
      name: "Administração",
      lastMessage: "Lembrete: pagamento da mensalidade",
      lastActivity: "há 1h",
      avatar: "https://images.unsplash.com/photo-1519648023493-d82b5f8d7b8a?w=100&h=100&fit=crop&crop=face",
      role: 'admin',
      unreadCount: 0,
      online: false
    },
    {
      id: 3,
      name: "Helena Feliciano (Secretária)",
      lastMessage: "Sua próxima aula está agendada para...",
      lastActivity: "há 3h",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b047?w=100&h=100&fit=crop&crop=face",
      role: 'admin',
      unreadCount: 0,
      online: true
    },
    {
      id: 4,
      name: "Suporte Técnico",
      lastMessage: "Como posso ajudá-lo hoje?",
      lastActivity: "ontem",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      role: 'admin',
      unreadCount: 1,
      online: false
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: "Prof. Esmael Nelson",
      senderRole: 'teacher',
      content: "Olá! Como está indo a prática dos acordes que vimos na última aula?",
      timestamp: "14:30",
      isMe: false
    },
    {
      id: 2,
      sender: "Você",
      senderRole: 'student',
      content: "Olá professor! Estou praticando todos os dias. O acorde de Sol ainda está um pouco difícil.",
      timestamp: "14:32",
      isMe: true
    },
    {
      id: 3,
      sender: "Prof. Esmael Nelson",
      senderRole: 'teacher',
      content: "É normal no início. Vou gravar um vídeo específico sobre a posição dos dedos no Sol maior. Te ajudará bastante!",
      timestamp: "14:35",
      isMe: false
    },
    {
      id: 4,
      sender: "Você",
      senderRole: 'student',
      content: "Seria ótimo! Muito obrigado professor. 🎸",
      timestamp: "14:36",
      isMe: true
    },
    {
      id: 5,
      sender: "Prof. Esmael Nelson",
      senderRole: 'teacher',
      content: "Ótimo progresso na última aula! Continue assim que logo estará tocando músicas completas.",
      timestamp: "14:40",
      isMe: false
    }
  ];

  const selectedChatRoom = chatRooms.find(room => room.id === selectedChat);

  const filteredChats = chatRooms.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aqui você adicionaria a lógica para enviar a mensagem
      console.log("Enviando mensagem:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher': return 'Professor';
      case 'admin': return 'Administração';
      case 'student': return 'Aluno';
      case 'parent': return 'Responsável';
      default: return 'Usuário';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar onLogin={() => setShowLogin(true)} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Music className="h-12 w-12 text-amber-300" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Chat - Cantinho do Canto
            </h1>
            <p className="text-lg mb-6 text-blue-100 max-w-2xl mx-auto">
              Comunique-se diretamente com professores e administração
            </p>
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="h-[600px] flex overflow-hidden">
              {/* Sidebar - Lista de Conversas */}
              <div className="w-1/3 border-r bg-white">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Conversas</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar conversa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-y-auto h-[480px]">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedChat === chat.id ? 'bg-amber-50 border-r-4 border-r-amber-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={chat.avatar} alt={chat.name} />
                              <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            {chat.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
                              <span className="text-xs text-gray-500">{chat.lastActivity}</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                              {chat.unreadCount > 0 && (
                                <Badge className="bg-amber-500 text-white text-xs">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <Badge className={`${getRoleColor(chat.role)} text-xs mt-1`}>
                              {getRoleLabel(chat.role)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                {selectedChatRoom && (
                  <CardHeader className="border-b bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={selectedChatRoom.avatar} alt={selectedChatRoom.name} />
                            <AvatarFallback>{selectedChatRoom.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {selectedChatRoom.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedChatRoom.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleColor(selectedChatRoom.role)}>
                              {getRoleLabel(selectedChatRoom.role)}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {selectedChatRoom.online ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                )}

                {/* Messages Area */}
                <CardContent className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isMe
                              ? 'bg-amber-500 text-white'
                              : 'bg-white text-gray-800 border'
                          }`}
                        >
                          {!message.isMe && (
                            <div className="text-xs font-semibold mb-1 text-gray-600">
                              {message.sender}
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <span className={`text-xs ${message.isMe ? 'text-amber-100' : 'text-gray-500'} mt-1 block`}>
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handleSendMessage} className="bg-amber-500 hover:bg-amber-600">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
};

export default Chat;
