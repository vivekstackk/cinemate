import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function StaggeredPageTransition({
  trigger,
  onViewSwap,
  columns = 5,
  duration = 0.75,
  staggerDelay = 0.075,
  ease = [0.85, 0, 0.15, 1],
  direction = "top",
  exitOpposite = true,
}) {
  const [transitionState, setTransitionState] = useState("idle");
  const onViewSwapRef = useRef(onViewSwap);

  useEffect(() => {
    onViewSwapRef.current = onViewSwap;
  }, [onViewSwap]);

  useEffect(() => {
    if (trigger > 0) {
      setTimeout(() => setTransitionState("entering"), 0);

      const totalAnimationTime = (duration + (columns - 1) * staggerDelay) * 1000;

      const coverTimeout = setTimeout(() => {
        if (onViewSwapRef.current) onViewSwapRef.current();
        setTransitionState("covered");
      }, totalAnimationTime);

      const exitTimeout = setTimeout(() => {
        setTransitionState("exiting");
      }, totalAnimationTime + 50);

      const idleTimeout = setTimeout(() => {
        setTransitionState("idle");
      }, totalAnimationTime * 2 + 50);

      return () => {
        clearTimeout(coverTimeout);
        clearTimeout(exitTimeout);
        clearTimeout(idleTimeout);
      };
    }
  }, [trigger, columns, duration, staggerDelay]);

  if (transitionState === "idle") return null;

  const panels = Array.from({ length: columns }, (_, i) => i);
  const isVertical = direction === "top" || direction === "bottom";

  const getTransform = (state) => {
    if (isVertical) {
      const isEnterBottom = direction === "bottom";
      if (state === "enter") {
        return { y: isEnterBottom ? "100dvh" : "-100dvh", x: "0dvw" };
      } else {
        return exitOpposite
          ? { y: isEnterBottom ? "-100dvh" : "100dvh", x: "0dvw" }
          : { y: isEnterBottom ? "100dvh" : "-100dvh", x: "0dvw" };
      }
    } else {
      const isEnterRight = direction === "right";
      if (state === "enter") {
        return { x: isEnterRight ? "100dvw" : "-100dvw", y: "0dvh" };
      } else {
        return exitOpposite
          ? { x: isEnterRight ? "-100dvw" : "100dvw", y: "0dvh" }
          : { x: isEnterRight ? "100dvw" : "-100dvw", y: "0dvh" };
      }
    }
  };

  return (
    <div
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 9999, // ensures it covers the header (z-index: 1000)
        display: "flex",
        flexDirection: isVertical ? "row" : "column",
        height: "100dvh",
        width: "100dvw",
      }}
    >
      {panels.map((i) => {
        return (
          <motion.div
            key={i}
            initial={getTransform("enter")}
            animate={
              transitionState === "entering"
                ? { x: "0dvw", y: "0dvh" }
                : transitionState === "exiting"
                ? getTransform("exit")
                : { x: "0dvw", y: "0dvh" }
            }
            transition={{
              duration: duration,
              ease: ease,
              delay: i * staggerDelay,
            }}
            style={{
              pointerEvents: "auto",
              height: "100%",
              flex: 1,
              backgroundColor: "#0a0a0f", // Dark cinematic theme color
              borderRight: isVertical ? "1px solid rgba(255,255,255,0.03)" : "none",
              borderBottom: !isVertical ? "1px solid rgba(255,255,255,0.03)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

export function RouteTransitionProvider({
  children,
  columns = 5,
  duration = 0.75,
  staggerDelay = 0.075,
  ease = [0.85, 0, 0.15, 1],
  direction = "top",
  exitOpposite = true,
}) {
  const [trigger, setTrigger] = useState(0);
  const [pendingUrl, setPendingUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  useEffect(() => {
    const handleLinkClick = (e) => {
      const target = e.target.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      if (target.href === window.location.href) {
        return;
      }

      // Verify it's a valid local route change
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("//") &&
        !href.startsWith("#") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        !href.startsWith("javascript:") &&
        targetAttr !== "_blank" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        e.stopPropagation();

        setPendingUrl(href);
        setTrigger((prev) => prev + 1);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  const handleViewSwap = () => {
    if (pendingUrl) {
      navigate(pendingUrl);
    }
  };

  return (
    <>
      {mounted && (
        <StaggeredPageTransition
          trigger={trigger}
          onViewSwap={handleViewSwap}
          columns={columns}
          duration={duration}
          staggerDelay={staggerDelay}
          ease={ease}
          direction={direction}
          exitOpposite={exitOpposite}
        />
      )}
      {children}
    </>
  );
}
