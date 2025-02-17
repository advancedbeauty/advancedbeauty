import Aboutsection from '@/components/home/Aboutsection'
import Awardsection from '@/components/home/Awardsection'
import Certificatesection from '@/components/home/Certificate.section'
import Faqsection from '@/components/home/Faq.section'

const page = () => {
  return (
    <main className='w-full min-h-screen'>
      <Aboutsection />
      <Awardsection />
      <Certificatesection />
      <Faqsection />
    </main>
  )
}

export default page
