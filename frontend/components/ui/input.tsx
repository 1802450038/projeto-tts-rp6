import { Plus } from 'lucide-react-native'
import * as React from 'react'
import { TextInput, View } from 'react-native'
import { cn } from '~/lib/utils'
import { Label } from './label'
import { Text } from './text'

type InputProps = React.ComponentPropsWithoutRef<typeof TextInput> & {
  label?: string
  isRequired?: boolean
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  errorMessage?: React.ReactNode
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      className,
      placeholderClassName,
      startContent,
      endContent,
      label,
      isRequired,
      errorMessage,
      ...props
    },
    ref
  ) => {
    const id = React.useId()

    return (
      <View className="flex flex-col gap-1">
        {label && (
          <Label className={'min-w-fit w-full px-0.5'} nativeID={`input-${id}`}>
            {label} {isRequired && <Text className="text-red-500">*</Text>}
          </Label>
        )}
        <View className="relative w-full flex flex-row flex-grow">
          {startContent && (
            <View className="z-20 absolute left-0 top-0 flex flex-row gap-2 items-center h-full">
              {startContent}
            </View>
          )}
          <TextInput
            ref={ref}
            id={`input-${id}`}
            className={cn(
              'w-full self-grow web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
              props.editable === false && 'opacity-50 web:cursor-not-allowed',
              endContent && 'pr-8',
              startContent && 'pl-10',
              className
            )}
            placeholderClassName={cn(
              'text-muted-foreground',
              placeholderClassName
            )}
            {...props}
          />
          {endContent && (
            <View className="z-20 absolute right-0 top-0 flex flex-row gap-2 items-center h-full">
              {endContent}
            </View>
          )}
        </View>
        {errorMessage && (
          <Text className="text-destructive text-sm px-0.5">
            {errorMessage}
          </Text>
        )}
      </View>
    )
  }
)

Input.displayName = 'Input'

export { Input }
