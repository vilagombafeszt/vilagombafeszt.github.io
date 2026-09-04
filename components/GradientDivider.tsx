import { twMerge } from 'tailwind-merge';

interface GradientDividerProps {
  topColor: string;
  bottomColor: string;
  className?: string;
}

export default function GradientDivider({
  topColor,
  bottomColor,
  className = '',
}: GradientDividerProps) {
  return (
    <div
      className={twMerge('relative z-20 h-[40px] w-full md:hidden', className)}
      style={{
        background: `linear-gradient(to bottom, ${topColor}, ${bottomColor})`,
      }}
    />
  );
}
