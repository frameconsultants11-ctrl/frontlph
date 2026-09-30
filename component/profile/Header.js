import BackButton from "../BackButton";

export default function HeaderComp({heading, desc, Icon}){
    return(
        <>
         <BackButton/>

      <div className="mb-7 mt-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-[#173f32]
            "
          >
            <Icon
              size={19}
            />
          </div>

          <div>
            <h1 className="text-[20px] font-bold tracking-[-0.4px] text-[#1d2923]">
              {heading}
            </h1>

            <p className="mt-0.5 text-[11px] text-gray-400">
              {desc}
            </p>
          </div>
        </div>
      </div>
        </>
    )
}