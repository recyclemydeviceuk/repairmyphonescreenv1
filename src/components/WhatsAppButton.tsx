import { useSiteSettings } from "../lib/SiteSettingsContext";

const WHATSAPP_MESSAGE = "Hi! I need help with my phone repair.";

export default function WhatsAppButton() {
  const { general } = useSiteSettings();

  // Clean the number — remove spaces, +, dashes, parens
  const number = general.whatsappNumber.replace(/[\s+()-]/g, "") || "447761665499";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-7 w-7" fill="white">
        <path d="M16.004 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.35.63 4.552 1.728 6.452L2.667 29.333l7.104-1.698A13.28 13.28 0 0 0 16.004 29.333C23.37 29.333 29.333 23.364 29.333 16S23.37 2.667 16.004 2.667zm0 2.4c5.956 0 10.929 4.972 10.929 10.933 0 5.96-4.973 10.933-10.929 10.933a10.89 10.89 0 0 1-5.588-1.534l-.394-.237-4.217 1.007.998-4.102-.26-.415A10.89 10.89 0 0 1 5.075 16c0-5.961 4.973-10.933 10.929-10.933zm-3.177 5.6c-.22 0-.576.082-.877.408-.3.326-1.148 1.12-1.148 2.733s1.175 3.17 1.339 3.39c.163.218 2.274 3.63 5.605 4.944 2.775 1.095 3.336.877 3.936.822.6-.054 1.935-.79 2.208-1.553.272-.763.272-1.417.19-1.553-.081-.136-.3-.218-.627-.38-.327-.164-1.935-.954-2.235-1.063-.3-.11-.517-.163-.735.163-.218.326-.845 1.063-1.035 1.28-.19.22-.38.247-.708.082-.327-.163-1.38-.508-2.627-1.62-.972-.865-1.629-1.932-1.82-2.258-.19-.326-.02-.503.143-.666.147-.146.327-.38.49-.571.164-.19.218-.327.327-.544.11-.218.055-.408-.027-.572-.082-.163-.72-1.798-.998-2.46-.245-.582-.5-.588-.708-.598-.19-.009-.408-.011-.627-.011z" />
      </svg>
    </a>
  );
}
