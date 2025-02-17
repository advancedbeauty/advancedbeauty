interface HeadingProps {
  text: string
  isS?: Boolean
}

const Heading: React.FC<HeadingProps> = ({ text, isS }) => {
  return (
    <div className="w-full flex items-end justify-center uppercase font-semibold text-center text-2xl sm:text-3xl transition">
      {text}
      {isS && <span className="text-base sm:text-xl">s</span>}
    </div>
  )
}

export default Heading
