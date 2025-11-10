import gsap from 'gsap';

/**
 * GSAP animation utilities for the flashcard application
 */

/**
 * Card flip animation (3D rotation effect)
 */
export function flipCard(
  element: HTMLElement,
  onComplete?: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline({
    onComplete,
  });

  tl.to(element, {
    rotationY: 90,
    duration: 0.3,
    ease: 'power2.in',
  }).to(element, {
    rotationY: 0,
    duration: 0.3,
    ease: 'power2.out',
  });

  return tl;
}

/**
 * Success feedback animation (green pulse/glow)
 */
export function successAnimation(element: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.to(element, {
    scale: 1.05,
    boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)',
    duration: 0.3,
    ease: 'power2.out',
  }).to(element, {
    scale: 1,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    duration: 0.3,
    ease: 'power2.in',
  });

  return tl;
}

/**
 * Error feedback animation (red shake)
 */
export function errorAnimation(element: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.to(element, {
    x: -10,
    duration: 0.1,
  })
    .to(element, {
      x: 10,
      duration: 0.1,
    })
    .to(element, {
      x: -10,
      duration: 0.1,
    })
    .to(element, {
      x: 0,
      duration: 0.1,
    })
    .to(
      element,
      {
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
        duration: 0.2,
      },
      0
    )
    .to(element, {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      duration: 0.2,
    });

  return tl;
}

/**
 * Progress bar animation
 */
export function animateProgressBar(
  element: HTMLElement,
  progress: number
): gsap.core.Tween {
  return gsap.to(element, {
    width: `${progress}%`,
    duration: 0.5,
    ease: 'power2.out',
  });
}

/**
 * Fade in animation
 */
export function fadeIn(
  element: HTMLElement,
  duration = 0.5
): gsap.core.Tween {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      ease: 'power2.out',
    }
  );
}

/**
 * Fade out animation
 */
export function fadeOut(
  element: HTMLElement,
  duration = 0.3
): gsap.core.Tween {
  return gsap.to(element, {
    opacity: 0,
    y: -20,
    duration,
    ease: 'power2.in',
  });
}

/**
 * Stagger animation for list items
 */
export function staggerIn(
  elements: HTMLElement[],
  stagger = 0.1
): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.fromTo(
    elements,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger,
      ease: 'power2.out',
    }
  );

  return tl;
}

/**
 * Celebration animation (scale pulse)
 */
export function celebrationAnimation(
  element: HTMLElement
): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.to(element, {
    scale: 1.1,
    duration: 0.3,
    ease: 'back.out(1.7)',
  })
    .to(element, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.in',
    })
    .to(
      element,
      {
        boxShadow: '0 0 40px rgba(147, 51, 234, 0.6)',
        duration: 0.3,
      },
      0
    )
    .to(element, {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      duration: 0.3,
    });

  return tl;
}

/**
 * Card transition animation
 */
export function transitionCard(
  outElement: HTMLElement,
  inElement: HTMLElement,
  onMidpoint?: () => void
): gsap.core.Timeline {
  const tl = gsap.timeline();

  tl.to(outElement, {
    opacity: 0,
    x: -50,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: onMidpoint,
  }).fromTo(
    inElement,
    {
      opacity: 0,
      x: 50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.3,
      ease: 'power2.out',
    }
  );

  return tl;
}
