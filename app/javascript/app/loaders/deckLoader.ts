interface DeckLoaderProps {
  id: string
}

export const deckLoader = ({ params }: any): DeckLoaderProps => ({
  id: params.deckId,
})
