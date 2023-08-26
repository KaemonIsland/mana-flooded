interface SetLoaderProps {
  id: string
}

export const setLoader = ({ params }: any): SetLoaderProps => ({
  id: params.setId,
})
