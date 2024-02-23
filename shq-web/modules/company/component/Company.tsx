import { useShq } from "../hooks/useShq"

const Company = ({ type }: { type: string }) => {
  const { shq } = useShq()

  const emptyMessage = () => {
    return (
      <div className="bg-white flex justify-center items-center overflow-hidden mt-[20px] rounded-lg">
        <div className="flex flex-col justify-center items-center p-10">
          <h1 className="text-[60px] mb-8 text-[#818C8B]">Oh no!</h1>
          <p className="w-[60%] text-center">
            Sorry. the content you’re looking for doesn’t uploaded. Either it
            was removed, or have not uploaded yet.
          </p>
        </div>
        <img src="/images/error.png" />
      </div>
    )
  }

  if (type === "structure") {
    return shq.structure ? (
      <div dangerouslySetInnerHTML={{ __html: shq.structure || "" }} />
    ) : (
      emptyMessage()
    )
  }

  return shq.vision ? (
    <div dangerouslySetInnerHTML={{ __html: shq.vision || "" }} />
  ) : (
    emptyMessage()
  )
}

export default Company
