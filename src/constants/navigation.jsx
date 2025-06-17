import { MdHomeFilled } from "react-icons/md";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { MdOutlineMovie } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineWorkspacePremium } from "react-icons/md";

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
    },
    {
        label: 'Plans',
        href: 'subscription',
        icon: <MdOutlineWorkspacePremium/>
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