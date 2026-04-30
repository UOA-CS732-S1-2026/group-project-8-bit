"use client";

import { useState, type CSSProperties } from "react";

type EmberConfig = {
  left: string;
  bottom: string;
  delay: string;
  duration: string;
  drift: string;
  size: number;
};

type EndAshesProps = {
  onClose?: () => void;
};

const EMBERS: EmberConfig[] = [
  {
    left: "7%",
    bottom: "2%",
    delay: "0s",
    duration: "7s",
    drift: "24px",
    size: 3,
  },
  {
    left: "13%",
    bottom: "4%",
    delay: "1.4s",
    duration: "5.8s",
    drift: "-18px",
    size: 2.5,
  },
  {
    left: "21%",
    bottom: "1%",
    delay: "0.7s",
    duration: "8.2s",
    drift: "30px",
    size: 4,
  },
  {
    left: "30%",
    bottom: "3%",
    delay: "2.2s",
    duration: "6.4s",
    drift: "-14px",
    size: 2,
  },
  {
    left: "39%",
    bottom: "2%",
    delay: "0.2s",
    duration: "9s",
    drift: "20px",
    size: 3,
  },
  {
    left: "47%",
    bottom: "5%",
    delay: "1.9s",
    duration: "6.6s",
    drift: "-24px",
    size: 2.5,
  },
  {
    left: "55%",
    bottom: "1%",
    delay: "3s",
    duration: "7.6s",
    drift: "16px",
    size: 3,
  },
  {
    left: "63%",
    bottom: "3%",
    delay: "0.6s",
    duration: "5.4s",
    drift: "-28px",
    size: 2,
  },
  {
    left: "71%",
    bottom: "2%",
    delay: "2.1s",
    duration: "8.4s",
    drift: "26px",
    size: 4,
  },
  {
    left: "79%",
    bottom: "5%",
    delay: "1.1s",
    duration: "6.2s",
    drift: "-20px",
    size: 2.5,
  },
  {
    left: "87%",
    bottom: "1%",
    delay: "3.4s",
    duration: "7.2s",
    drift: "28px",
    size: 3,
  },
  {
    left: "94%",
    bottom: "3%",
    delay: "0.8s",
    duration: "5.6s",
    drift: "-15px",
    size: 2,
  },
  {
    left: "17%",
    bottom: "2%",
    delay: "3.8s",
    duration: "6.8s",
    drift: "22px",
    size: 3,
  },
  {
    left: "35%",
    bottom: "4%",
    delay: "4.4s",
    duration: "8s",
    drift: "-26px",
    size: 2.5,
  },
  {
    left: "52%",
    bottom: "2%",
    delay: "4.9s",
    duration: "6s",
    drift: "18px",
    size: 2,
  },
  {
    left: "68%",
    bottom: "4%",
    delay: "5.2s",
    duration: "7.4s",
    drift: "-22px",
    size: 3.5,
  },
  {
    left: "83%",
    bottom: "2%",
    delay: "4.6s",
    duration: "8.6s",
    drift: "25px",
    size: 2.5,
  },
  {
    left: "97%",
    bottom: "4%",
    delay: "5.6s",
    duration: "6.6s",
    drift: "-18px",
    size: 3,
  },
];

export default function EndAshes({ onClose }: EndAshesProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Close ashes ending scene"
      className="absolute inset-0 z-20 block h-full w-full cursor-pointer overflow-hidden bg-black p-0 text-left"
      onClick={handleClose}
    >
      <span
        aria-hidden="true"
        className="end-ashes-enter absolute inset-0 block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/quests/theEnd/endBText.png')" }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block bg-[radial-gradient(circle_at_50%_20%,rgba(255,220,140,0.14)_0%,rgba(0,0,0,0)_42%),linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.24)_100%)]"
      />

      {EMBERS.map((ember, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="animate-ember pointer-events-none absolute rounded-full"
          style={
            {
              left: ember.left,
              bottom: ember.bottom,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              backgroundColor: "#fbbf24",
              boxShadow: `0 0 ${ember.size * 2}px #f59e0b, 0 0 ${ember.size * 4}px #d97706`,
              "--ember-duration": ember.duration,
              "--ember-delay": ember.delay,
              "--ember-drift": ember.drift,
            } as CSSProperties
          }
        />
      ))}
    </button>
  );
}
