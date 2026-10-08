"use client";

import {
  CheckCheck,
  ChevronLeft,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

const BRAND_COLOR = "#b9d63b";

const EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😎",
  "🤩",
  "🥳",
  "🤗",
  "🤔",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "😣",
  "😥",
  "😮",
  "🤐",
  "😯",
  "😪",
  "😫",
  "🥱",
  "😴",
  "🤓",
  "🫡",
  "😕",
  "😟",
  "🙁",
  "☹️",
  "😲",
  "😳",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤝",
  "👍",
  "👎",
  "👏",
  "🙌",
  "🙏",
  "💪",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "💯",
  "🔥",
  "✨",
  "🎉",
  "🎊",
  "⭐",
  "🌟",
  "💫",
  "✅",
  "❌",
  "⚡",
  "🚀",
  "💡",
  "🎯",
  "☕",
  "🍕",
  "🙈",
  "🙊",
  "🙉",
];

export default function ChatPage({ user }) {
  const [conversations, setConversations] =
    useState([]);

  const [selectedTrainer, setSelectedTrainer] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [loadingChats, setLoadingChats] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [showInfo, setShowInfo] =
    useState(false);

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const messagesContainerRef =
    useRef(null);

  const messageInputRef =
    useRef(null);

  const scrollToBottomRef =
    useRef(false);

  const selectedTrainerRef =
    useRef(null);

  /* =====================================================
     PREVENT PAGE / BODY SCROLL
  ===================================================== */

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow =
      html.style.overflow;

    const previousBodyOverflow =
      body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow =
        previousHtmlOverflow;

      body.style.overflow =
        previousBodyOverflow;
    };
  }, []);

  /* =====================================================
     SELECTED TRAINER REF
  ===================================================== */

  useEffect(() => {
    selectedTrainerRef.current =
      selectedTrainer?.id || null;
  }, [selectedTrainer?.id]);

  /* =====================================================
     LOAD CONVERSATIONS
  ===================================================== */

  useEffect(() => {
    loadConversations();
  }, []);

  /* =====================================================
     LOAD MESSAGES WHEN TRAINER CHANGES
  ===================================================== */

  useEffect(() => {
    if (!selectedTrainer?.id) {
      setMessages([]);
      return;
    }

    scrollToBottomRef.current =
      false;

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }

    setShowEmojiPicker(false);

    loadMessages(
      selectedTrainer.id
    );
  }, [selectedTrainer?.id]);

  /* =====================================================
     MESSAGE SCROLL
  ===================================================== */

  useEffect(() => {
    const container =
      messagesContainerRef.current;

    if (!container) {
      return;
    }

    requestAnimationFrame(() => {
      if (scrollToBottomRef.current) {
        container.scrollTop =
          container.scrollHeight;

        scrollToBottomRef.current =
          false;
      } else {
        container.scrollTop = 0;
      }
    });
  }, [messages]);

  /* =====================================================
     LOAD CONVERSATIONS
  ===================================================== */

  const loadConversations = async () => {
    try {
      setLoadingChats(true);

      const response = await fetch(
        "/api/messages/conversations",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load conversations"
        );
      }

      const chats =
        data.conversations || [];

      setConversations(chats);

      const currentId =
        selectedTrainerRef.current;

      if (currentId) {
        const currentChat =
          chats.find(
            (chat) =>
              chat.id === currentId
          );

        if (currentChat) {
          setSelectedTrainer(
            currentChat
          );

          return;
        }
      }

      if (chats.length > 0) {
        setSelectedTrainer(
          chats[0]
        );
      }
    } catch (error) {
      console.error(
        "Load conversations error:",
        error
      );
    } finally {
      setLoadingChats(false);
    }
  };

  /* =====================================================
     LOAD MESSAGES
  ===================================================== */

  const loadMessages = async (
    trainerId
  ) => {
    try {
      setLoadingMessages(true);

      const response = await fetch(
        `/api/messages?trainerId=${encodeURIComponent(
          trainerId
        )}`,
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load messages"
        );
      }

      if (
        selectedTrainerRef.current !==
        trainerId
      ) {
        return;
      }

      setMessages(
        data.messages || []
      );
    } catch (error) {
      console.error(
        "Load messages error:",
        error
      );

      if (
        selectedTrainerRef.current ===
        trainerId
      ) {
        setMessages([]);
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  /* =====================================================
     INSERT EMOJI
  ===================================================== */

  const insertEmoji = (emoji) => {
    const textarea =
      messageInputRef.current;

    if (!textarea) {
      setMessage(
        (previous) =>
          previous + emoji
      );

      setShowEmojiPicker(false);

      return;
    }

    const start =
      textarea.selectionStart ??
      message.length;

    const end =
      textarea.selectionEnd ??
      message.length;

    const newMessage =
      message.slice(0, start) +
      emoji +
      message.slice(end);

    setMessage(newMessage);

    setShowEmojiPicker(false);

    requestAnimationFrame(() => {
      textarea.focus();

      const cursorPosition =
        start + emoji.length;

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    });
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const handleSend = async () => {
    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      !selectedTrainer?.id ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        "/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            trainerId:
              selectedTrainer.id,
            message:
              trimmedMessage,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to send message"
        );
      }

      setMessage("");

      setShowEmojiPicker(false);

      scrollToBottomRef.current =
        true;

      await loadMessages(
        selectedTrainer.id
      );

      await loadConversations();
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      alert(
        error.message ||
          "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  /* =====================================================
     ENTER TO SEND
  ===================================================== */

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredConversations =
    conversations.filter((chat) =>
      chat.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  /* =====================================================
     SELECT TRAINER
  ===================================================== */

  const selectConversation = (
    chat
  ) => {
    setShowInfo(false);

    setShowEmojiPicker(false);

    scrollToBottomRef.current =
      false;

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }

    setMessages([]);

    setSelectedTrainer(chat);
  };

  /* =====================================================
     MOBILE BACK
  ===================================================== */

  const handleMobileBack = () => {
    setSelectedTrainer(null);

    setShowInfo(false);

    setShowEmojiPicker(false);

    setMessages([]);
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main
      className="
        h-[calc(100dvh-64px)]
        max-h-[calc(100dvh-64px)]
        w-full
        overflow-hidden
        bg-[#f7f9f2]
      "
    >
      <div
        className="
          h-full
          min-h-0
          w-full
          flex
          overflow-hidden
          bg-white
        "
      >
        {/* =================================================
            LEFT TRAINER LIST
        ================================================= */}

        <aside
          className={`
            w-full
            md:w-[300px]
            lg:w-[320px]
            shrink-0
            min-h-0
            h-full
            border-r
            border-gray-100
            bg-white
            ${
              selectedTrainer
                ? "hidden md:flex"
                : "flex"
            }
            flex-col
            overflow-hidden
          `}
        >
          {/* HEADER */}

          <div className="shrink-0 px-5 pt-5 pb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">
                Chats
              </h1>

              <div
                className="
                  w-9
                  h-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
                style={{
                  backgroundColor:
                    `${BRAND_COLOR}20`,
                }}
              >
                <MessageCircle
                  className="w-4 h-4"
                  style={{
                    color:
                      BRAND_COLOR,
                  }}
                />
              </div>
            </div>

            {/* SEARCH */}

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search messages..."
                className="
                  w-full
                  h-10
                  rounded-xl
                  bg-gray-50
                  border
                  border-gray-100
                  pl-9
                  pr-3
                  text-sm
                  outline-none
                  focus:border-[#b9d63b]
                  focus:ring-2
                  focus:ring-[#b9d63b]/20
                "
              />
            </div>
          </div>

          {/* TRAINER LIST */}

          <div
            className="
              flex-1
              min-h-0
              overflow-y-auto
              overflow-x-hidden
              px-2
              pb-4
              overscroll-contain
            "
          >
            {loadingChats ? (
              <ConversationSkeleton />
            ) : filteredConversations.length ===
              0 ? (
              <EmptyChats />
            ) : (
              filteredConversations.map(
                (chat) => (
                  <ConversationItem
                    key={chat.id}
                    chat={chat}
                    active={
                      selectedTrainer?.id ===
                      chat.id
                    }
                    onClick={() =>
                      selectConversation(
                        chat
                      )
                    }
                  />
                )
              )
            )}
          </div>

          {/* CURRENT USER */}

          <div
            className="
              hidden
              md:flex
              shrink-0
              items-center
              gap-3
              p-4
              border-t
              border-gray-100
              bg-white
            "
          >
            <Avatar
              src={user?.image}
              name={user?.name}
              size="sm"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.name}
              </p>

              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </aside>

        {/* =================================================
            CHAT AREA
        ================================================= */}

        <section
          className={`
            flex-1
            min-w-0
            min-h-0
            h-full
            overflow-hidden
            ${
              selectedTrainer
                ? "flex"
                : "hidden md:flex"
            }
            flex-col
            bg-[#fbfcf8]
          `}
        >
          {!selectedTrainer ? (
            <NoChatSelected />
          ) : (
            <>
              {/* CHAT HEADER */}

              <header
                className="
                  h-[72px]
                  min-h-[72px]
                  shrink-0
                  flex
                  items-center
                  justify-between
                  px-4
                  sm:px-6
                  border-b
                  border-gray-100
                  bg-white
                "
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* MOBILE BACK */}

                  <button
                    type="button"
                    onClick={
                      handleMobileBack
                    }
                    className="
                      md:hidden
                      w-9
                      h-9
                      rounded-full
                      flex
                      items-center
                      justify-center
                      hover:bg-gray-100
                    "
                    aria-label="Back"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>

                  <Avatar
                    src={
                      selectedTrainer.image
                    }
                    name={
                      selectedTrainer.name
                    }
                    size="md"
                  />

                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {
                        selectedTrainer.name
                      }
                    </h2>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="
                          w-1.5
                          h-1.5
                          rounded-full
                        "
                        style={{
                          backgroundColor:
                            BRAND_COLOR,
                        }}
                      />

                      <span
                        className="text-xs"
                        style={{
                          color:
                            "#789000",
                        }}
                      >
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* THREE DOTS */}

                <button
                  type="button"
                  onClick={() =>
                    setShowInfo(
                      (value) =>
                        !value
                    )
                  }
                  className="
                    w-9
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    hover:bg-gray-100
                    transition
                  "
                  aria-label="More options"
                  aria-expanded={
                    showInfo
                  }
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </header>

              {/* =================================================
                  CHAT MESSAGES
              ================================================= */}

              <div
                ref={
                  messagesContainerRef
                }
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  overflow-x-hidden
                  px-4
                  sm:px-8
                  py-6
                  overscroll-contain
                "
              >
                {loadingMessages ? (
                  <MessageSkeleton />
                ) : messages.length ===
                  0 ? (
                  <EmptyConversation
                    trainer={
                      selectedTrainer
                    }
                  />
                ) : (
                  <div className="w-full space-y-3">
                    <div className="flex justify-center mb-6">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full">
                        Conversation
                      </span>
                    </div>

                    {messages.map(
                      (
                        item,
                        index
                      ) => {
                        const isMine =
                          item.senderId?.toString() ===
                          user?.id?.toString();

                        return (
                          <ChatMessage
                            key={
                              item._id ||
                              item.id ||
                              index
                            }
                            message={item}
                            isMine={
                              isMine
                            }
                            user={user}
                            trainer={
                              selectedTrainer
                            }
                          />
                        );
                      }
                    )}
                  </div>
                )}
              </div>

              {/* =================================================
                  MESSAGE INPUT
              ================================================= */}

              <div
                className="
                  shrink-0
                  border-t
                  border-gray-100
                  bg-white
                  px-3
                  sm:px-5
                  py-3
                "
              >
                <div className="w-full">
                  <div
                    className="
                      flex
                      items-end
                      gap-2
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      px-2
                      py-2
                      focus-within:border-[#b9d63b]
                      focus-within:ring-2
                      focus-within:ring-[#b9d63b]/20
                      transition
                    "
                  >
                    {/* ATTACHMENT */}

                    <button
                      type="button"
                      className="
                        hidden
                        sm:flex
                        w-9
                        h-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        hover:bg-gray-50
                        text-gray-400
                      "
                      aria-label="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* TEXTAREA */}

                    <textarea
                      ref={
                        messageInputRef
                      }
                      value={message}
                      onChange={(
                        event
                      ) =>
                        setMessage(
                          event.target
                            .value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      rows={1}
                      placeholder="Write a message..."
                      className="
                        flex-1
                        resize-none
                        max-h-28
                        min-h-[36px]
                        py-2
                        px-2
                        text-sm
                        text-gray-800
                        placeholder:text-gray-400
                        outline-none
                        bg-transparent
                      "
                    />

                    {/* =================================================
                        EMOJI
                    ================================================= */}

                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setShowEmojiPicker(
                            (value) =>
                              !value
                          )
                        }
                        className="
                          w-9
                          h-9
                          flex
                          items-center
                          justify-center
                          rounded-xl
                          hover:bg-gray-50
                          text-gray-400
                          transition
                        "
                        aria-label="Emoji"
                        aria-expanded={
                          showEmojiPicker
                        }
                      >
                        <Smile className="w-4 h-4" />
                      </button>

                      {showEmojiPicker && (
                        <div
                          className="
                            absolute
                            bottom-[48px]
                            right-0
                            z-[100]
                            w-[280px]
                            sm:w-[320px]
                            bg-white
                            border
                            border-gray-200
                            rounded-2xl
                            shadow-xl
                            p-3
                          "
                        >
                          {/* PICKER HEADER */}

                          <div className="flex items-center justify-between mb-2 px-1">
                            <p className="text-xs font-semibold text-gray-700">
                              Choose an emoji
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                setShowEmojiPicker(
                                  false
                                )
                              }
                              className="
                                text-xs
                                text-gray-400
                                hover:text-gray-700
                              "
                            >
                              Close
                            </button>
                          </div>

                          {/* EMOJI GRID */}

                          <div
                            className="
                              grid
                              grid-cols-7
                              sm:grid-cols-8
                              gap-1
                              max-h-[220px]
                              overflow-y-auto
                              overscroll-contain
                              pr-1
                            "
                          >
                            {EMOJIS.map(
                              (
                                emoji,
                                index
                              ) => (
                                <button
                                  key={`${emoji}-${index}`}
                                  type="button"
                                  onClick={() =>
                                    insertEmoji(
                                      emoji
                                    )
                                  }
                                  className="
                                    w-9
                                    h-9
                                    sm:w-10
                                    sm:h-10
                                    flex
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-xl
                                    hover:bg-[#b9d63b]/20
                                    active:scale-90
                                    transition
                                  "
                                  aria-label={`Add ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SEND */}

                    <button
                      type="button"
                      onClick={
                        handleSend
                      }
                      disabled={
                        sending ||
                        !message.trim()
                      }
                      className="
                        w-10
                        h-10
                        shrink-0
                        rounded-xl
                        text-gray-900
                        flex
                        items-center
                        justify-center
                        transition
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                      "
                      style={{
                        backgroundColor:
                          BRAND_COLOR,
                      }}
                      aria-label="Send message"
                    >
                      {sending ? (
                        <span
                          className="
                            w-4
                            h-4
                            border-2
                            border-black/20
                            border-t-gray-900
                            rounded-full
                            animate-spin
                          "
                        />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="hidden sm:block text-[10px] text-gray-400 mt-2 text-center">
                    Press Enter to send ·
                    Shift + Enter for a
                    new line
                  </p>
                </div>
              </div>
            </>
          )}
        </section>

        {/* =================================================
            DESKTOP CONTACT INFO
        ================================================= */}

        {selectedTrainer &&
          showInfo && (
            <aside
              className="
                hidden
                xl:flex
                w-[280px]
                shrink-0
                h-full
                min-h-0
                border-l
                border-gray-100
                bg-white
                flex-col
                overflow-hidden
              "
            >
              <TrainerInfo
                trainer={
                  selectedTrainer
                }
                onClose={() =>
                  setShowInfo(false)
                }
              />
            </aside>
          )}
      </div>

      {/* =================================================
          MOBILE CONTACT INFO
      ================================================= */}

      {showInfo &&
        selectedTrainer && (
          <div
            className="
              xl:hidden
              fixed
              inset-0
              z-[99999]
              bg-black/40
              flex
              justify-end
            "
            onClick={() =>
              setShowInfo(false)
            }
          >
            <div
              className="
                w-[85%]
                max-w-[340px]
                h-full
                min-h-0
                bg-white
                shadow-2xl
                overflow-hidden
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <TrainerInfo
                trainer={
                  selectedTrainer
                }
                onClose={() =>
                  setShowInfo(false)
                }
              />
            </div>
          </div>
        )}
    </main>
  );
}

/* =========================================================
   CONVERSATION ITEM
========================================================= */

function ConversationItem({
  chat,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full
        text-left
        flex
        items-center
        gap-3
        px-3
        py-3
        rounded-xl
        transition
        ${
          active
            ? "text-gray-900"
            : "hover:bg-gray-50 text-gray-800"
        }
      `}
      style={
        active
          ? {
              backgroundColor:
                BRAND_COLOR,
            }
          : undefined
      }
    >
      <Avatar
        src={chat.image}
        name={chat.name}
        size="md"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`
              text-sm
              font-semibold
              truncate
              ${
                active
                  ? "text-gray-900"
                  : "text-gray-800"
              }
            `}
          >
            {chat.name}
          </p>

          <span
            className={`
              text-[10px]
              shrink-0
              ${
                active
                  ? "text-gray-700"
                  : "text-gray-400"
              }
            `}
          >
            {formatTime(
              chat.updatedAt
            )}
          </span>
        </div>

        <p
          className={`
            text-xs
            truncate
            mt-1
            ${
              active
                ? "text-gray-700"
                : "text-gray-400"
            }
          `}
        >
          {chat.lastMessage ||
            "Start a conversation"}
        </p>
      </div>

      {chat.unreadCount > 0 && (
        <span
          className="
            w-5
            h-5
            rounded-full
            text-[10px]
            flex
            items-center
            justify-center
            text-gray-900
          "
          style={{
            backgroundColor:
              active
                ? "#ffffff"
                : BRAND_COLOR,
          }}
        >
          {chat.unreadCount}
        </span>
      )}
    </button>
  );
}

/* =========================================================
   CHAT MESSAGE
========================================================= */

function ChatMessage({
  message,
  isMine,
  user,
  trainer,
}) {
  return (
    <div
      className={`
        flex
        items-end
        gap-2
        ${
          isMine
            ? "justify-end"
            : "justify-start"
        }
      `}
    >
      {!isMine && (
        <Avatar
          src={trainer?.image}
          name={trainer?.name}
          size="sm"
        />
      )}

      <div
        className={`
          max-w-[78%]
          sm:max-w-[65%]
          ${
            isMine
              ? "items-end"
              : "items-start"
          }
          flex
          flex-col
        `}
      >
        <div
          className={`
            px-4
            py-2.5
            text-sm
            leading-6
            whitespace-pre-wrap
            break-words
            ${
              isMine
                ? "text-gray-900 rounded-2xl rounded-br-md"
                : "bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-bl-md shadow-sm"
            }
          `}
          style={
            isMine
              ? {
                  backgroundColor:
                    BRAND_COLOR,
                }
              : undefined
          }
        >
          {message.message}
        </div>

        <div
          className={`
            flex
            items-center
            gap-1
            mt-1
            px-1
            ${
              isMine
                ? "justify-end"
                : "justify-start"
            }
          `}
        >
          <span className="text-[10px] text-gray-400">
            {formatTime(
              message.createdAt
            )}
          </span>

          {isMine && (
            <CheckCheck
              className="w-3.5 h-3.5"
              style={{
                color: BRAND_COLOR,
              }}
            />
          )}
        </div>
      </div>

      {isMine && (
        <Avatar
          src={user?.image}
          name={user?.name}
          size="sm"
        />
      )}
    </div>
  );
}

/* =========================================================
   TRAINER INFO
========================================================= */

function TrainerInfo({
  trainer,
  onClose,
}) {
  return (
    <div
      className="
        h-full
        min-h-0
        flex
        flex-col
        overflow-y-auto
        overscroll-contain
      "
    >
      <div
        className="
          shrink-0
          flex
          items-center
          justify-between
          px-5
          py-4
          border-b
          border-gray-100
          bg-white
        "
      >
        <h3 className="font-semibold text-gray-900">
          Contact Info
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="
            w-8
            h-8
            rounded-full
            flex
            items-center
            justify-center
            hover:bg-gray-100
          "
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="p-6 text-center">
        <Avatar
          src={trainer.image}
          name={trainer.name}
          size="xl"
        />

        <h2 className="text-lg font-bold text-gray-900 mt-4">
          {trainer.name}
        </h2>

        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor:
                BRAND_COLOR,
            }}
          />

          <span
            className="text-xs"
            style={{
              color: "#789000",
            }}
          >
            Online
          </span>
        </div>
      </div>

      <div className="px-5">
        <InfoRow
          label="Trainer ID"
          value={trainer.id}
        />

        {trainer.email && (
          <InfoRow
            label="Email"
            value={trainer.email}
          />
        )}

        {trainer.hourlyRate ? (
          <InfoRow
            label="Hourly Rate"
            value={`₹${Number(
              trainer.hourlyRate
            ).toLocaleString(
              "en-IN"
            )}`}
          />
        ) : null}
      </div>

      {trainer.about && (
        <div className="px-5 mt-5 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            About
          </p>

          <div className="mt-2 text-xs text-gray-500 leading-5">
            {trainer.about}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="py-3 border-b border-gray-100">
      <p className="text-[11px] text-gray-400 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-sm text-gray-700 mt-1 break-all">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   AVATAR
========================================================= */

function Avatar({
  src,
  name,
  size = "md",
}) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    xl: "w-24 h-24",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    xl: "text-2xl",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        shrink-0
        rounded-full
        overflow-hidden
        bg-gray-100
        flex
        items-center
        justify-center
      `}
    >
      {src ? (
        <img
          src={src}
          alt={name || "User"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span
          className={`
            ${textSizes[size]}
            font-semibold
          `}
          style={{
            color: BRAND_COLOR,
          }}
        >
          {(name || "U")
            .charAt(0)
            .toUpperCase()}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   EMPTY CHATS
========================================================= */

function EmptyChats() {
  return (
    <div className="px-5 py-16 text-center">
      <div
        className="
          w-12
          h-12
          mx-auto
          rounded-2xl
          flex
          items-center
          justify-center
        "
        style={{
          backgroundColor:
            `${BRAND_COLOR}20`,
        }}
      >
        <MessageCircle
          className="w-5 h-5"
          style={{
            color: BRAND_COLOR,
          }}
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-800 mt-4">
        No conversations
      </h3>

      <p className="text-xs text-gray-400 mt-1">
        Your trainer conversations will
        appear here.
      </p>
    </div>
  );
}

/* =========================================================
   NO CHAT SELECTED
========================================================= */

function NoChatSelected() {
  return (
    <div className="flex-1 min-h-0 flex items-center justify-center">
      <div className="text-center px-6">
        <div
          className="
            w-16
            h-16
            mx-auto
            rounded-2xl
            flex
            items-center
            justify-center
          "
          style={{
            backgroundColor:
              `${BRAND_COLOR}20`,
          }}
        >
          <MessageCircle
            className="w-7 h-7"
            style={{
              color: BRAND_COLOR,
            }}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mt-5">
          Select a conversation
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Choose a trainer from the left
          to start chatting.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY CONVERSATION
========================================================= */

function EmptyConversation({
  trainer,
}) {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center">
        <Avatar
          src={trainer.image}
          name={trainer.name}
          size="xl"
        />

        <h3 className="text-base font-semibold text-gray-900 mt-4">
          Start chatting with{" "}
          {trainer.name}
        </h3>

        <p className="text-sm text-gray-400 mt-1">
          Send your first message below.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   CONVERSATION SKELETON
========================================================= */

function ConversationSkeleton() {
  return (
    <div className="space-y-2 px-2">
      {[1, 2, 3, 4, 5, 6].map(
        (item) => (
          <div
            key={item}
            className="
              flex
              items-center
              gap-3
              p-3
              animate-pulse
            "
          >
            <div className="w-10 h-10 rounded-full bg-gray-200" />

            <div className="flex-1">
              <div className="w-24 h-3 bg-gray-200 rounded" />

              <div className="w-36 h-2.5 bg-gray-100 rounded mt-2" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* =========================================================
   MESSAGE SKELETON
========================================================= */

function MessageSkeleton() {
  return (
    <div className="w-full space-y-5 animate-pulse">
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200" />

        <div className="w-40 h-12 rounded-2xl bg-gray-200" />
      </div>

      <div className="flex justify-end">
        <div
          className="w-52 h-12 rounded-2xl"
          style={{
            backgroundColor:
              `${BRAND_COLOR}50`,
          }}
        />
      </div>

      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200" />

        <div className="w-56 h-12 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

/* =========================================================
   TIME
========================================================= */

function formatTime(date) {
  if (!date) {
    return "";
  }

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}