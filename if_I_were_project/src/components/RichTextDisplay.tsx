import { useEffect, useRef } from 'react';

type RichTextDisplayProps = {
  html: string;
  className?: string;
  fontFamily?: string;
};

export function RichTextDisplay({ html, className = '', fontFamily = 'sans-serif' }: RichTextDisplayProps) {
  // 1. We create a reference to access the printed HTML
  const containerRef = useRef<HTMLDivElement>(null);

  if (!html || html.trim() === '') {
    return null;
  }

  // 2. Your existing Font Logic (Preserved)
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

  // 3. THE FIX: Find links and force them to open in a new tab
  useEffect(() => {
    if (!containerRef.current) return;

    // Find all 'a' (link) tags inside the content
    const links = containerRef.current.getElementsByTagName('a');
    
    for (const link of links) {
      // Force open in new tab
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      
      // Style them to match your Fuchsia theme
      link.style.color = '#E879F9'; // Fuchsia color
      link.style.textDecoration = 'underline';
      link.style.textDecorationColor = 'rgba(232, 121, 249, 0.4)';
      link.style.transition = 'all 0.3s ease';
      
      // Add hover effect
      link.onmouseenter = () => {
        link.style.color = '#F0ABFC';
        link.style.textShadow = '0 0 10px rgba(232, 121, 249, 0.5)';
      };
      link.onmouseleave = () => {
        link.style.color = '#E879F9';
        link.style.textShadow = 'none';
      };
    }
  }, [html]); // Re-run this whenever the HTML content changes

  return (
    <div
      ref={containerRef} // Attach the ref here so we can find the links
      className={`prose max-w-none ${getFontClass(fontFamily)} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}