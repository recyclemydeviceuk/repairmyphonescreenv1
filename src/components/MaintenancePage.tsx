import { Wrench } from "lucide-react";

interface Props {
  message?: string;
  email?:   string;
}

export default function MaintenancePage({ message, email }: Props) {
  const contactEmail = email?.trim() || 'hello@repairmyphonescreen.co.uk';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
              <Wrench size={40} className="text-red-500" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500" />
            </span>
          </div>
        </div>

        <p className="text-[13px] font-bold uppercase tracking-widest text-red-400 mb-3">
          Repair My Phone Screen
        </p>

        <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
          We're Under Maintenance
        </h1>

        <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
          {message?.trim()
            ? message
            : "We are currently undergoing scheduled maintenance. We'll be back shortly!"}
        </p>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[12px] text-gray-400 font-medium">We'll be right back</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-[13px] text-gray-400">
          Need urgent help?{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            {contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
