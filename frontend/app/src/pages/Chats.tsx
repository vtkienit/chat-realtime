import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header/Header";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import clsx from "clsx";
import {
  AlertCircle,
  ArrowLeft,
  Image,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
} from "lucide-react";

type ChatUser = {
  id: number;
  name: string;
  email: string;
  color?: string;
  role: string;
};

type ConversationResponse = {
  id: number;
  user1: ChatUser;
  user2: ChatUser;
  createdAt: string;
};

type ChatMessage = {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  user: ChatUser;
};

type ApiErrorResponse = {
  message?: string;
};

const API_URL = "http://localhost:8080";

export default function Chats() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<ReturnType<Client["subscribe"]> | null>(null);
  const activeConversationIdRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const filteredUsers = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );
    });
  }, [users, searchValue]);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getStoredUser = () => {
    const userJson = localStorage.getItem("user");

    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as ChatUser;
    } catch {
      return null;
    }
  };

  const getFirstLetter = (name?: string) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "?";
  };

  const getAvatarColor = (user?: ChatUser | null) => {
    return user?.color || "#3B82F6";
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 80);
  };

  const parseResponseJson = async <T,>(response: Response) => {
    const text = await response.text();

    if (!text) return null as T;

    return JSON.parse(text) as T;
  };

  const authHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const subscribeConversation = (selectedConversationId: number) => {
    const client = clientRef.current;

    if (!client || !client.connected) return;

    subscriptionRef.current?.unsubscribe();

    activeConversationIdRef.current = selectedConversationId;

    subscriptionRef.current = client.subscribe(
      `/broadcast/conversations/${selectedConversationId}/messages`,
      (message: IMessage) => {
        const newMessage = JSON.parse(message.body) as ChatMessage;

        setMessages((prev) => {
          const existed = prev.some((item) => item.id === newMessage.id);

          if (existed) return prev;

          return [...prev, newMessage];
        });

        scrollToBottom();
      }
    );
  };

  const connectWebSocket = () => {
    const token = getToken();

    if (!token) return;
    if (clientRef.current?.active) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_URL}/ws`),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        if (activeConversationIdRef.current) {
          subscribeConversation(activeConversationIdRef.current);
        }
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    client.activate();
    clientRef.current = client;
  };

  const fetchMessages = async (selectedConversationId: number) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoadingMessages(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/conversations/${selectedConversationId}/messages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await parseResponseJson<ChatMessage[] | ApiErrorResponse>(
        response
      );

      if (!response.ok) {
        throw new Error(
          (data as ApiErrorResponse)?.message || "Failed to load messages"
        );
      }

      setMessages((data as ChatMessage[]) || []);
      scrollToBottom();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const createOrGetConversation = async (
    loginUserId: number,
    receiverId: number
  ) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return null;
    }

    const response = await fetch(`${API_URL}/api/conversations`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        user1Id: loginUserId,
        user2Id: receiverId,
      }),
    });

    const data = await parseResponseJson<
      ConversationResponse | ApiErrorResponse
    >(response);

    if (!response.ok) {
      throw new Error(
        (data as ApiErrorResponse)?.message || "Failed to create conversation"
      );
    }

    return data as ConversationResponse;
  };

  const openConversation = async (
    receiver: ChatUser,
    loginUser = currentUser
  ) => {
    if (!loginUser) {
      navigate("/login");
      return;
    }

    if (receiver.id === loginUser.id) {
      setError("Cannot create conversation with yourself");
      return;
    }

    setSelectedUser(receiver);
    setMessages([]);
    setError("");

    try {
      const conversation = await createOrGetConversation(
        loginUser.id,
        receiver.id
      );

      if (!conversation) return;

      setConversationId(conversation.id);
      activeConversationIdRef.current = conversation.id;

      await fetchMessages(conversation.id);
      subscribeConversation(conversation.id);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const fetchUsers = async () => {
    const token = getToken();
    const loginUser = getStoredUser();

    if (!token || !loginUser) {
      navigate("/login");
      return;
    }

    setCurrentUser(loginUser);
    setIsLoadingUsers(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/users/exclude`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseResponseJson<ChatUser[] | ApiErrorResponse>(
        response
      );

      if (!response.ok) {
        throw new Error(
          (data as ApiErrorResponse)?.message || "Failed to load users"
        );
      }

      const allUsers = (data as ChatUser[]) || [];

      setUsers(allUsers);

      if (allUsers.length > 0) {
        await openConversation(allUsers[0], loginUser);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const sendMessage = () => {
    const content = messageInput.trim();
    const token = getToken();

    if (!content || !conversationId || !token) return;

    const client = clientRef.current;

    if (!client || !client.connected) {
      setError("WebSocket is not connected yet.");
      return;
    }

    setIsSending(true);

    client.publish({
      destination: `/app/conversations/${conversationId}/messages`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
      }),
    });

    setMessageInput("");
    setIsSending(false);
  };

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setConversationId(null);
    setMessages([]);
    subscriptionRef.current?.unsubscribe();
  };

  useEffect(() => {
    connectWebSocket();
    fetchUsers();

    return () => {
      subscriptionRef.current?.unsubscribe();
      clientRef.current?.deactivate();
    };
  }, []);

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-bg-subtle">
      <Helmet>
        <title>Chats</title>
      </Helmet>

      <Header />

      <section className="flex-1 min-h-0 overflow-hidden bg-bg-subtle">
        <div className="h-full max-w-7xl mx-auto px-0 lg:px-8 overflow-hidden">
          <div
            className="
              h-full min-h-0 grid grid-cols-1 md:grid-cols-[360px_minmax(0,1fr)]
              border-x border-border bg-bg overflow-hidden
            "
          >
            {/* LEFT SIDEBAR */}
            <aside
              className={clsx(
                "min-h-0 overflow-hidden flex-col border-r border-border bg-bg",
                selectedUser ? "hidden md:flex" : "flex"
              )}
            >
              <div className="shrink-0 px-4 py-4 border-b border-border">
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-2xl font-bold text-text">Đoạn chat</h1>

                  <button
                    type="button"
                    className="
                      w-10 h-10 rounded-full bg-bg-secondary
                      flex items-center justify-center text-text-secondary
                      hover:text-primary transition-colors cursor-pointer
                    "
                  >
                    <MoreHorizontal size={22} />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-full bg-bg-secondary px-4 py-2.5">
                  <Search size={18} className="shrink-0 text-text-secondary" />

                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Tìm kiếm trên Messenger"
                    className="
                      w-full bg-transparent outline-none
                      text-sm text-text placeholder:text-text-tertiary
                    "
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 overflow-x-auto hide-scrollbar">
                  <button
                    type="button"
                    className="shrink-0 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                  >
                    Tất cả
                  </button>

                  <button
                    type="button"
                    className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-bg-secondary"
                  >
                    Chưa đọc
                  </button>

                  <button
                    type="button"
                    className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-bg-secondary"
                  >
                    Nhóm
                  </button>
                </div>
              </div>

              {/* USER LIST SCROLL */}
              <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 overscroll-contain">
                {isLoadingUsers && (
                  <div className="flex items-center justify-center py-10 text-text-secondary">
                    <Loader2 size={22} className="animate-spin" />
                  </div>
                )}

                {!isLoadingUsers &&
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => openConversation(user)}
                      className={clsx(
                        "w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors cursor-pointer",
                        selectedUser?.id === user.id
                          ? "bg-bg-secondary"
                          : "hover:bg-bg-secondary"
                      )}
                    >
                      <div
                        className="
                          w-[52px] h-[52px] rounded-full
                          flex items-center justify-center
                          text-white text-lg font-bold shrink-0
                        "
                        style={{ backgroundColor: getAvatarColor(user) }}
                      >
                        {getFirstLetter(user.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-text truncate">
                            {user.name}
                          </p>

                          {selectedUser?.id === user.id && (
                            <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                          )}
                        </div>

                        <p className="mt-0.5 text-sm text-text-secondary truncate">
                          Click để bắt đầu chat
                        </p>
                      </div>
                    </button>
                  ))}

                {!isLoadingUsers && filteredUsers.length === 0 && (
                  <div className="px-4 py-8 text-center text-text-secondary">
                    Không tìm thấy user nào.
                  </div>
                )}
              </div>
            </aside>

            {/* RIGHT CHAT */}
            <main
              className={clsx(
                "min-h-0 min-w-0 flex-col bg-bg overflow-hidden",
                selectedUser ? "flex" : "hidden md:flex"
              )}
            >
              {!selectedUser ? (
                <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5">
                    <MessageCircle size={38} />
                  </div>

                  <h2 className="text-2xl font-semibold text-text">
                    Chọn một đoạn chat
                  </h2>

                  <p className="mt-2 text-text-secondary">
                    Chọn user ở bên trái để bắt đầu nhắn tin realtime.
                  </p>
                </div>
              ) : (
                <>
                  {/* CHAT HEADER */}
                  <div className="shrink-0 h-16 border-b border-border px-3 md:px-4 flex items-center justify-between bg-bg">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={handleBackToUsers}
                        className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-secondary cursor-pointer"
                      >
                        <ArrowLeft size={22} />
                      </button>

                      <div
                        className="
                          w-10 h-10 rounded-full
                          flex items-center justify-center
                          text-white font-bold shrink-0
                        "
                        style={{
                          backgroundColor: getAvatarColor(selectedUser),
                        }}
                      >
                        {getFirstLetter(selectedUser.name)}
                      </div>

                      <div className="min-w-0">
                        <h2 className="font-semibold text-text truncate">
                          {selectedUser.name}
                        </h2>

                        <p className="text-xs text-text-secondary truncate">
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 cursor-pointer"
                    >
                      <MoreHorizontal size={22} />
                    </button>
                  </div>

                  {/* ERROR */}
                  {error && (
                    <div className="shrink-0 mx-3 md:mx-4 mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                      <AlertCircle size={18} className="mt-0.5 shrink-0" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {/* MESSAGES SCROLL */}
                  <div className="flex-1 min-h-0 overflow-y-auto px-3 md:px-4 py-5 bg-bg overscroll-contain">
                    {isLoadingMessages ? (
                      <div className="h-full flex items-center justify-center text-text-secondary">
                        <Loader2 size={24} className="animate-spin" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary">
                        <MessageCircle size={34} className="mb-3" />
                        <p>Chưa có tin nhắn nào.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {messages.map((message) => {
                          const isMine = message.senderId === currentUser?.id;
                          const sender = message.user || selectedUser;

                          return (
                            <div
                              key={message.id}
                              className={clsx(
                                "flex items-end gap-2",
                                isMine ? "justify-end" : "justify-start"
                              )}
                            >
                              {!isMine && (
                                <div
                                  className="
                                    w-8 h-8 rounded-full
                                    flex items-center justify-center
                                    text-white text-xs font-bold shrink-0
                                  "
                                  style={{
                                    backgroundColor: getAvatarColor(sender),
                                  }}
                                >
                                  {getFirstLetter(sender.name)}
                                </div>
                              )}

                              <div
                                className={clsx(
                                  "max-w-[82%] md:max-w-[70%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                                  isMine
                                    ? "bg-primary text-white rounded-br-md"
                                    : "bg-bg-secondary text-text rounded-bl-md"
                                )}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>

                                <p
                                  className={clsx(
                                    "mt-1 text-[11px]",
                                    isMine
                                      ? "text-white/75"
                                      : "text-text-tertiary"
                                  )}
                                >
                                  {formatMessageTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* INPUT */}
                  <form
                    onSubmit={handleSubmitMessage}
                    className="shrink-0 border-t border-border bg-bg px-3 md:px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="
                          w-10 h-10 rounded-full shrink-0
                          flex items-center justify-center
                          text-primary hover:bg-primary/10 cursor-pointer
                        "
                      >
                        <Image size={22} />
                      </button>

                      <input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Aa"
                        className="
                          min-w-0 flex-1 rounded-full bg-bg-secondary
                          px-4 py-2.5 text-sm text-text outline-none
                          placeholder:text-text-tertiary
                        "
                      />

                      <button
                        type="submit"
                        disabled={!messageInput.trim() || isSending}
                        className="
                          w-10 h-10 rounded-full shrink-0
                          flex items-center justify-center
                          bg-primary text-white
                          hover:bg-primary/85 transition-colors cursor-pointer
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        <Send size={19} />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}