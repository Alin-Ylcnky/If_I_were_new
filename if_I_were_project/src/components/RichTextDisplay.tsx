type RichTextDisplayProps = {
  html: string;
  className?: string;
  fontFamily?: string;
};

export function RichTextDisplay({ html, className = '', fontFamily = 'sans-serif' }: RichTextDisplayProps) {
  if (!html || html.trim() === '') {
    return null;
  }

  const getFontClass = (family: string) => {
    const fontMap: Record<string, string> = {
      'sans-serif': 'font-sans',
      'sans': 'font-sans',
      'dm-sans': 'font-dm-sans',
      'open-sans': 'font-open-sans',
      'raleway': 'font-raleway',
      'montserrat': 'font-montserrat',
      'roboto': 'font-roboto',
      'poppins': 'font-poppins',
      'condensed': 'font-condensed',
      'serif': 'font-serif',
      'crimson': 'font-crimson',
      'lora': 'font-lora',
      'merriweather': 'font-merriweather',
      'baskerville': 'font-baskerville',
      'handwriting': 'font-handwriting',
      'allura': 'font-allura',
      'bebas': 'font-bebas',
      'monospace': 'font-mono',
      'mono': 'font-mono',
    };
    return fontMap[family] || 'font-sans';
  };

  return (
    <div
      className={`prose max-w-none ${getFontClass(fontFamily)} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
