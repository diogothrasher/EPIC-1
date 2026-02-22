import { useState, useEffect } from 'react'

interface BreakpointState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
}

/**
 * Hook para detectar breakpoints Tailwind e reagir a mudanças de tamanho
 * Usa addEventListener para escutar resize events
 *
 * @returns Object com flags booleanas para cada breakpoint
 *
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoint()
 * if (isMobile) return <MobileView />
 */
export const useBreakpoint = (): BreakpointState => {
  const [state, setState] = useState<BreakpointState>({
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 640 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 640 && window.innerWidth < 1024 : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setState({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        width,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return state
}
