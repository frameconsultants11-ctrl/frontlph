
import HeaderComp from "@/component/profile/Header";
import ReferralShareCard from "@/component/profile/ReferralShareCard";
import WalletPage from "@/component/profile/WalletPage";
import { auth } from "@/lib/auth";
import { WalletCards } from "lucide-react";

export default async function Page(){
    const session = await auth()
    return(
        <>
        <HeaderComp heading="Wallet & Transcations" desc="Manage your password and active sessions" Icon={WalletCards} />
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-3/5">
        <WalletPage />
        </div>
        <div className="w-full sm:w-2/5">
            <ReferralShareCard referralCode={session?.user?.referralCode} domain='http://localhost:3000' />
            </div>
        </div>
        </>
    )
}