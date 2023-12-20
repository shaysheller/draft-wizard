import Link from "next/link";
import { useAppStore } from "~/app-store";

export const Header = () => {
  return <header className=" h-fit w-full">{<NavItems />}</header>;
};

export const NavItems = () => {
  const draftPick = useAppStore((state) => state.DraftPick);
  return (
    <>
      <div className="h-4"></div>
      <ul className="sticky top-4 z-50 flex w-full justify-between  text-gray-900 ">
        <li></li>
        <li>
          <Link className="hover:underline" href={`/`}>
            HOME
          </Link>
        </li>
        <li>
          <Link className="hover:underline" href={`/draft`}>
            DRAFT
          </Link>
        </li>
        <li>
          <Link className="hover:underline" href={`/roster/${draftPick}`}>
            ROSTERS
          </Link>
        </li>
        <li>
          <Link className="hover:underline" href={`/standings`}>
            STANDINGS
          </Link>
        </li>
        <li>
          <Link className="hover:underline" href={`/about/`}>
            ABOUT
          </Link>
        </li>
        <li></li>
      </ul>
    </>
  );
};
