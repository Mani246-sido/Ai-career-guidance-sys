export default function AuroraBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-40 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #A5D8FF 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full opacity-30 blur-[110px]"
        style={{ background: 'radial-gradient(circle, #5B5FEF 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full opacity-25 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #E8B94E 0%, transparent 70%)' }}
      />
    </div>
  );
}
