"use client";

import {
  useRef,
  useEffect,
  useState,
  type ReactPortal,
  useCallback,
} from "react";
import { useAppStore } from "~/app-store";
import { createPortal } from "react-dom";

// could make the wrapping of the modal more reusable and the internal contents more specific but idk if that is worth rn
export const Modal = () => {
  const setInitialDraftSettings = useAppStore(
    (state) => state.setInitialDraftSettings
  );
  const numTeamsRef = useRef<HTMLInputElement>(null);
  const draftPickRef = useRef<HTMLInputElement>(null);
  const draftRoundsRef = useRef<HTMLInputElement>(null);
  const [portal, setPortal] = useState<ReactPortal | null>(null);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // might only be necessary for mobile? I was able to type letters in this field on my ipad
      const a = Number(numTeamsRef.current?.value);
      const b = Number(draftPickRef.current?.value);
      if (isNaN(a) || isNaN(b)) {
        if (isNaN(a)) numTeamsRef.current?.focus();
        if (isNaN(b)) draftPickRef.current?.focus();
        return;
      }

      if (b > a) {
        alert("Pick # cannot be larger than # of teams - Please re-enter");
        return;
      }

      if (a < 2) {
        alert("Need at least 2 teams!");
      }

      const numTeams = Number(numTeamsRef.current?.value);
      const draftPick = Number(draftPickRef.current?.value);
      const numRounds = Number(draftRoundsRef.current?.value);

      setInitialDraftSettings(numTeams, draftPick, numRounds);
    },
    [setInitialDraftSettings]
  );

  const initializePortal = useCallback(() => {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 shadow-md">
        <div className="h-fit w-fit rounded-lg bg-white">
          <form
            onSubmit={onSubmit}
            className="mb-4 rounded bg-white px-8 pb-8 pt-6"
          >
            <div>
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="teams"
              >
                # of Teams
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="teams"
                type="number"
                required
                min={1}
                max={16}
                ref={numTeamsRef}
              ></input>
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="pick"
              >
                What Pick are You?
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="pick"
                required
                type="number"
                min={1}
                max={16}
                ref={draftPickRef}
              ></input>
            </div>
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="teams"
            >
              How many rounds?
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="teams"
              type="number"
              required
              min={1}
              max={20}
              ref={draftRoundsRef}
            ></input>
            <div className="h-4"></div>
            <button
              className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>,
      document.body
    );
  }, [onSubmit]);

  useEffect(() => {
    const portal = initializePortal();
    setPortal(portal);
  }, [initializePortal]);

  return <>{portal}</>;
};
