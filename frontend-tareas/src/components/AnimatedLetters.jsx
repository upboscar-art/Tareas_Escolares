export default function AnimatedLetters({ text, className = '', delay = 0 }) {
  return (
    <span className={`animated-letter-group ${className}`}>
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="animated-letter"
          style={{ '--char-delay': `${delay + index * 35}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
