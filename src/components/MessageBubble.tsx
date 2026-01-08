import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../types';
import { formatMessageTime } from '../utils/formatters';
import { useAppSelector } from '../store/hooks';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const { currentUser } = useAppSelector((state) => state.auth);

  const getStatusIcon = () => {
    if (!isOwn) return null;

    switch (message.status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-[#00A884]" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
      <div
        className={`max-w-[65%] rounded-lg px-3 py-2 ${
          isOwn
            ? 'bg-[#005C4B] text-white'
            : 'bg-[#1F1F1F] text-white'
        } shadow-md`}
      >
        {message.replyTo && (
          <div className="bg-black/20 border-l-4 border-[#00A884] pl-2 py-1 mb-2 rounded">
            <p className="text-[#00A884] text-xs font-medium">Replying to message</p>
            <p className="text-gray-300 text-sm">Original message content...</p>
          </div>
        )}

        {message.type === 'image' && message.mediaUrl && (
          <img
            src={message.mediaUrl}
            alt="Message"
            className="rounded-lg mb-2 max-w-full"
          />
        )}

        {message.type === 'voice' && (
          <div className="flex items-center gap-2 py-1">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
            </div>
            <div className="flex-1 h-1 bg-white/20 rounded-full" />
            <span className="text-xs">0:15</span>
          </div>
        )}

        {message.type === 'document' && (
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
              <span className="text-xs">📄</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Document.pdf</p>
              <p className="text-xs text-gray-400">2.5 MB</p>
            </div>
          </div>
        )}

        {message.type === 'text' && (
          <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
        )}

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] text-gray-400">
            {formatMessageTime(message.timestamp)}
          </span>
          {getStatusIcon()}
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.slice(0, 3).map((reaction, idx) => (
              <span key={idx} className="text-sm">
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
