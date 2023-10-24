import { type RefObject } from "react";

export const isInViewPort = (element: HTMLDivElement) => {
  const bounding = element.getBoundingClientRect();

  if (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
  ) {
    console.log("In the viewport! :)");
    return true;
  } else {
    console.log("Not in the viewport. :(");
    return false;
  }
};

export const scrollToTop = (ref: RefObject<HTMLDivElement>) => {
  ref?.current?.scrollIntoView({
    behavior: "smooth",
  });
};
