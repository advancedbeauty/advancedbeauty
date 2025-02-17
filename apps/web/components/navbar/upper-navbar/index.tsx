import Container from '@workspace/ui/components/shared/Container'
import Section from '@workspace/ui/components/shared/Section'
import React from 'react'

interface UpperNavbarProps {
  className?: string
}

const UpperNavbar: React.FC<UpperNavbarProps> = ({ className }) => {
  return (
    <Section className={`${className} bg-[#FBF1EA] text-black py-1 relative`}>
      <Container className="w-full flex items-center justify-center">
        <span className="font-medium text-sm uppercase">10% off on all orders</span>
      </Container>
    </Section>
  )
}

export default UpperNavbar
