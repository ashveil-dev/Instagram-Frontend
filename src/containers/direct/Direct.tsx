import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/utils/hooks/redux";
import {
	createConversationApi,
	getConversationsApi,
	getMessagesApi,
	sendMessageApi,
} from "@/slices/user/profileApi";
import { DEFAULT_PROFILE_IMAGE } from "@/constants/profileImages";
import type { IConversation, IMessage } from "@/utils/types/user";
import { resolveMediaUrl } from "@/utils/mediaUrl";

function DirectContainer() {
	const location = useLocation();
	const me = useAppSelector((state) => state.profile.me);
	const conversationIdFromNav = (
		location.state as { conversationId?: string } | null
	)?.conversationId;
	const [conversations, setConversations] = useState<IConversation[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [activeUser, setActiveUser] = useState<{
		nickName: string;
		photo: string;
	} | null>(null);
	const [draft, setDraft] = useState("");
	const [loading, setLoading] = useState(true);

	const loadConversations = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getConversationsApi();
			setConversations(data.conversations);
		} finally {
			setLoading(false);
		}
	}, []);

	const openConversation = useCallback(async (id: string) => {
		setActiveId(id);
		const data = await getMessagesApi(id);
		setMessages(data.messages);
		setActiveUser({
			nickName: data.conversation.nickName,
			photo: data.conversation.photo,
		});
	}, []);

	useEffect(() => {
		loadConversations();
	}, [loadConversations]);

	useEffect(() => {
		if (conversationIdFromNav) {
			openConversation(conversationIdFromNav);
		}
	}, [conversationIdFromNav, openConversation]);

	const sendMessage = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!activeId || draft.trim() === "") return;

			const sent = await sendMessageApi(activeId, draft.trim());
			setMessages((prev) => [...prev, sent]);
			setDraft("");
			loadConversations();
		},
		[activeId, draft, loadConversations]
	);

	const startNewChat = useCallback(async () => {
		const recipientId = prompt("대화할 사용자 ID를 입력하세요");
		if (!recipientId) return;
		const conversation = await createConversationApi(recipientId);
		await loadConversations();
		openConversation(conversation.id);
	}, [loadConversations, openConversation]);

	return (
		<div className="flex w-full h-full border border-[#dbdbdb] rounded-[8px] overflow-hidden bg-white">
			<div className="w-[350px] border-r border-[#dbdbdb] flex flex-col">
				<div className="p-[20px] flex justify-between items-center border-b border-[#dbdbdb]">
					<span className="text-[20px] font-bold">
						{me?.nickName ?? "메시지"}
					</span>
					<button
						type="button"
						onClick={startNewChat}
						className="text-[24px] font-light"
						aria-label="새 메시지"
					>
						✎
					</button>
				</div>
				<div className="flex-grow overflow-y-auto">
					{loading && (
						<p className="p-[20px] text-[14px] text-[#737373]">
							불러오는 중...
						</p>
					)}
					{conversations.map((conversation) => (
						<button
							key={conversation.id}
							type="button"
							onClick={() => openConversation(conversation.id)}
							className={
								"w-full flex items-center gap-[12px] p-[12px] hover:bg-[#fafafa] text-left " +
								(activeId === conversation.id ? "bg-[#fafafa]" : "")
							}
						>
							<img
								src={
									conversation.photo
										? resolveMediaUrl(conversation.photo)
										: DEFAULT_PROFILE_IMAGE
								}
								alt=""
								className="w-[56px] h-[56px] rounded-full object-cover"
							/>
							<div className="flex-grow min-w-0">
								<div className="font-semibold text-[14px]">
									{conversation.nickName}
								</div>
								<div className="text-[14px] text-[#737373] truncate">
									{conversation.lastMessage || "메시지 없음"}
								</div>
							</div>
						</button>
					))}
					{!loading && conversations.length === 0 && (
						<p className="p-[20px] text-[14px] text-[#737373]">
							대화가 없습니다. 검색에서 사용자를 찾아 메시지를
							보내 보세요.
						</p>
					)}
				</div>
			</div>
			<div className="flex-grow flex flex-col">
				{activeId && activeUser ? (
					<>
						<div className="p-[16px] border-b border-[#dbdbdb] font-semibold flex items-center gap-[12px]">
							<img
								src={
									activeUser.photo
										? resolveMediaUrl(activeUser.photo)
										: DEFAULT_PROFILE_IMAGE
								}
								alt=""
								className="w-[24px] h-[24px] rounded-full"
							/>
							{activeUser.nickName}
						</div>
						<div className="flex-grow overflow-y-auto p-[20px] flex flex-col gap-[8px]">
							{messages.map((message) => (
								<div
									key={message.id}
									className={
										"max-w-[60%] px-[12px] py-[8px] rounded-[18px] text-[14px] " +
										(message.isMine
											? "self-end bg-[#0095f6] text-white"
											: "self-start bg-[#efefef]")
									}
								>
									{message.body}
								</div>
							))}
						</div>
						<form
							onSubmit={sendMessage}
							className="p-[16px] border-t border-[#dbdbdb] flex gap-[8px]"
						>
							<input
								value={draft}
								onChange={(e) => setDraft(e.target.value)}
								placeholder="메시지 입력..."
								className="flex-grow border border-[#dbdbdb] rounded-[8px] px-[12px] py-[8px] outline-none"
							/>
							<button
								type="submit"
								className="text-[#0095f6] font-semibold"
							>
								전송
							</button>
						</form>
					</>
				) : (
					<div className="flex-grow flex items-center justify-center text-[20px] font-light">
						메시지를 선택하세요
					</div>
				)}
			</div>
		</div>
	);
}

export default DirectContainer;
