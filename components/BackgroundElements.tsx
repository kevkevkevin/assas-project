export default function BackgroundElements() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-white">
      
      {/* 1. Top Left - Made it darker orange/red to pop against white */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
      
      {/* 2. Top Right - Purple/Blue for contrast */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
      
      {/* 3. Bottom Left - Your Primary Yellow */}
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      
      {/* Texture for that premium feel */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    
    </div>
  );
}