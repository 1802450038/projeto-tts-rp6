import { useFetch } from '~/hooks/useFetch'
import { useFocusChange } from '~/hooks/useFocusChange'
import type { Item } from './components/FlatItemList'
import { UploadDocuments } from './components/UploadDocuments'

type UploadDocumentsResponse = {
  dto: Item[]
}

export const UploadDocumentsList = () => {
  const { data, isLoading, refetch } =
    useFetch<UploadDocumentsResponse>('/documents')

  useFocusChange({ refetch })

  return <UploadDocuments data={data?.dto ?? []} isLoading={isLoading} />
}

export default UploadDocumentsList
