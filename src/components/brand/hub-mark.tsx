/** Marca do portal: esquadro + triângulo de desenho. Não usar o raio. */
export function HubMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="shrink-0" aria-hidden>
      <rect width="32" height="32" rx="7" className="fill-primary" />
      <path d="M8 7.5h3.5V21H24.5v3.5H8V7.5Z" className="fill-primary-fg" />
      <path d="M14.2 9.2 24.2 22.6H14.2V9.2Z" className="fill-primary-fg opacity-85" />
    </svg>
  );
}
