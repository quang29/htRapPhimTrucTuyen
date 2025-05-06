import { MdHomeFilled } from "react-icons/md";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { MdOutlineMovie } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";

export const navigation = [
    {
        label: 'TV Shows',
        href: 'tv',
        icon: <PiTelevisionSimpleBold/>
    },
    {
        label: 'Movies',
        href: 'movie',
        icon: <MdOutlineMovie/>
    }
]

export const mobileNavigation = [
    {
        label: 'Home',
        href: '/',
        icon: <MdHomeFilled/>
    },
    ...navigation,
    {
        label: 'search',
        href: '/search',
        icon: <IoSearchOutline/>
    }
]