import Link from "next/link";
import { useAppStore } from "~/app-store";

export const Header = () => {
  return <header className=" h-fit w-full">{<NavItems />}</header>;
};

export const NavItems = () => {
  const draftPick = useAppStore((state) => state.DraftPick);
  return (
    <ul className=" flex w-full justify-between bg-violet-500 font-bold text-white ">
      <li></li>
      <li>
        <Link className="hover:underline" href={`/`}>
          HOME
        </Link>
      </li>
      <li>
        <Link className="hover:underline" href={`/roster/${draftPick}`}>
          ROSTERS
        </Link>
      </li>
      <li>
        <Link className="hover:underline" href={`/`}>
          DEPTH CHARTS
        </Link>
      </li>
      <li>
        <Link className="hover:underline" href={`/about/`}>
          ABOUT
        </Link>
      </li>
      <li></li>
    </ul>
  );
};
