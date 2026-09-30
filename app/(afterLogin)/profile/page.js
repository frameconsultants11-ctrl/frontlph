import HeaderComp from "@/component/profile/Header"
import ProfilePage from "@/component/profile/ProfilePage"
import { auth } from "@/lib/auth"
import { User2Icon } from "lucide-react"


export default async function Page(){
    const session = await auth()
    return(
        <>
        <HeaderComp heading="Profile Management" desc="Manage your profile and interset here" Icon={User2Icon} />
        <ProfilePage/>
        </>
    )
}