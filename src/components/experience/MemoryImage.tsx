import { useState } from "react";

/** DOM image with elegant blush placeholder fallback */
export function MemoryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={
          "flex h-full w-full items-center justify-center bg-gradient-blush " + (className ?? "")
        }
      >
        <div className="text-center text-berry/70">
          <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-cream/70 leading-8">♡</div>
          <div className="font-hand text-lg">Your Memory Here</div>
        </div>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      className={"h-full w-full object-cover " + (className ?? "")}
    />
  );
}