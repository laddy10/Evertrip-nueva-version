"use client";

import Image from "next/image";
import { FaGoogle, FaStar, FaQuoteLeft } from "react-icons/fa";

export default function ReviewQRPage() {
  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            margin: 0; /* Removes default browser headers and footers */
            size: A4 portrait;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0;
            padding: 0;
            background: white !important;
          }
        }
      `}</style>
      
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 print:p-0 print:bg-white print:block">
        
        {/* Main Printable Area */}
        <div className="bg-white w-full max-w-2xl mx-auto rounded-[3rem] shadow-2xl print:shadow-none print:rounded-none relative overflow-hidden flex flex-col">
          
          {/* Elegant Top Border */}
          <div className="h-6 bg-brand-navy w-full absolute top-0 left-0 print:hidden"></div>
          
          {/* Content Wrapper */}
          <div className="px-10 py-16 flex-1 flex flex-col items-center justify-center text-center relative z-10">
            
            {/* Logo */}
            <div className="mb-10 mt-6">
              <Image
                src="/assets/logo2-normal.png"
                alt="Evertrip Logo"
                width={400}
                height={150}
                className="h-24 md:h-28 w-auto object-contain mx-auto"
                priority
              />
            </div>

            {/* Premium Quote Icon */}
            <FaQuoteLeft className="text-brand-accent/20 mb-3" size={28} />

            {/* Bilingual Message */}
            <div className="space-y-3 max-w-sm mx-auto">
              <p className="text-lg md:text-xl font-bold text-brand-navy font-sans leading-tight tracking-tight">
                Para nosotros es importante conocer tu opinión sobre tu experiencia en el viaje.
              </p>
              
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="h-px w-10 bg-brand-accent/30"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/50"></div>
                <div className="h-px w-10 bg-brand-accent/30"></div>
              </div>
              
              <p className="text-sm md:text-base font-medium text-brand-carbon/80 font-sans leading-relaxed">
                It is important for us to know your opinion about your travel experience.
              </p>
            </div>

            {/* Stars */}
            <div className="flex gap-2 mt-8 mb-4 text-[#FFB800]">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} size={32} />
              ))}
            </div>

            {/* Bottom Block for QR Code */}
            <div className="w-full bg-[#F8FAFC] border border-gray-100 mt-6 rounded-[2rem] p-8 flex flex-col items-center text-brand-navy relative shadow-sm print:shadow-none print:border-gray-200">
              
              {/* Google Header inside block */}
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-3 rounded-full text-[#4285F4] border-0 shadow-none ring-0">
                  <FaGoogle size={24} />
                </div>
                <div className="text-left">
                  <h2 className="text-xl md:text-2xl font-bold font-sans text-brand-navy">¡Califícanos en Google!</h2>
                  <p className="text-brand-carbon/60 font-medium text-base">Rate us on Google!</p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-2xl border-0 shadow-none ring-0 mb-4">
                <Image
                  src="/assets/review_qr.png"
                  alt="QR Code"
                  width={180}
                  height={180}
                  className="w-40 h-40 md:w-48 md:h-48 object-contain"
                  priority
                />
              </div>

              <p className="text-brand-carbon/60 font-bold tracking-[0.2em] uppercase text-xs">
                Escanea Aquí / Scan Here
              </p>
            </div>

            {/* Print Button */}
            <button 
              onClick={() => window.print()}
              className="mt-10 bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-colors print:hidden"
            >
              🖨️ Imprimir Aviso
            </button>
            
          </div>
        </div>
      </div>
    </>
  );
}
