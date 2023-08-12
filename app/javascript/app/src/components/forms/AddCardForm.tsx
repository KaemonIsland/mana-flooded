import React, { ReactElement, useState } from 'react'
import { Button, Flex, Text, Container } from '../../elements'
import { CheckboxConfirm } from '../../elements'

interface UpdateCard {
  (newQuantity: number, options?: any): void
}
interface AddCard {
  (options?: any): void
}
interface RemoveCard {
  (options?: any): void
}

interface Actions {
  update: UpdateCard
  add: AddCard
  remove: RemoveCard
}

interface ActionButtonProps {
  actions: Actions
  quantity: number
  collection?: any
  foil?: number
}

/**
 * A form that adds/updates/removes cards from a collection.
 *
 * Allows additional options like foil.
 *
 * actions - Add/Update/Delete card action functions
 * quantity - The current card quantity within the scope
 * collection - The total cards in collection (only shows if collection is present)
 */
export const AddCardForm = ({ actions, quantity, foil }: ActionButtonProps): ReactElement => {
  const [isFoil, setIsFoil] = useState(false)

  return (
    <Container padding={4} paddingRight={0} width="100%">
      <Text family="roboto" display="inline-block" title="Total">
        {`Normal: ${quantity ? quantity : 0}`}
      </Text>
      <Text family="roboto" display="inline-block" title="Total">
        {`Foil: ${foil ? foil : 0}`}
      </Text>
      <Container paddingBottom={2}>
        <CheckboxConfirm
          label="Is Foil?"
          removeHint
          value={isFoil}
          onChange={(): void => {
            setIsFoil(!isFoil)
          }}
        />
      </Container>
      <Flex alignItems="center" justifyContent="space-between">
        <Button
          color="grey"
          shade={8}
          size="small"
          variant="outline"
          bubble={false}
          isDisabled={!quantity}
          onClick={(): void => {
            const newQuantity = quantity - 1
            if (newQuantity) {
              actions.update(newQuantity, isFoil ? { foil: foil - 1 } : null)
            } else {
              actions.remove()
            }
          }}
        >
          Remove
        </Button>

        <Button
          hasCard={quantity}
          color="grey"
          shade={8}
          size="small"
          bubble={false}
          variant="outline"
          onClick={(): void => {
            if (quantity) {
              actions.update(quantity + 1, isFoil ? { foil: foil + 1 } : null)
            } else {
              actions.add(isFoil ? { foil: 1 } : null)
            }
          }}
        >
          Add
        </Button>
      </Flex>
    </Container>
  )
}
