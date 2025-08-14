import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { cn } from '~/lib/utils'

type PageLayoutProps = {
  children: React.ReactNode
  className?: string
}

export const PageLayout = ({ children, className }: PageLayoutProps) => {
  return (
    <SafeAreaView
      className={cn('flex-1 flex-col bg-[#E8F5E9] gap-8 pt-4', className)}
    >
      {children}
    </SafeAreaView>
  )
}
