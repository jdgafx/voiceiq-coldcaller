export default function ScriptVar({ text }: { text: string }) {
  const parts = text.split(/({{[^}]+}})/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('{{') ? (
          <span key={i} className="var-highlight">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
