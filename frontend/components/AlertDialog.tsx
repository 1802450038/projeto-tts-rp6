import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialog as Root
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { Text } from './ui/text'

type AlertDialogProps = {
  children: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  onCancel?: () => void
  onAction?: () => void
}

export const AlertDialog = ({
  children,
  isOpen,
  onOpenChange,
  title,
  description,
  onCancel,
  onAction
}: AlertDialogProps) => {
  return (
    <Root open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-destructive" onPress={onAction}>
            <Text>Continuar</Text>
          </AlertDialogAction>
          <AlertDialogCancel onPress={onCancel}>
            <Text>Cancelar</Text>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </Root>
  )
}
