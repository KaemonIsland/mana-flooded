import React, { ReactElement } from 'react'
import { Button } from './'
import { Flex, Text } from '../'
import styled from 'styled-components'
import { Feather } from '../../components/icon'

const ButtonLeft = styled(Button)`
  border-radius: 1rem 0 0 1rem;
  background-color: transparent;
`
const ButtonMiddle = styled.div`
  border-radius: 0;
  background-color: transparent;
  border: 1px solid ${({ theme }): string => theme.color['grey'][8]};
  display: inline-block;
  text-align: center;
  letter-spacing: 0.1rem;
  padding: ${({ theme }): string => [theme.spaceScale(1), theme.spaceScale(2)].join(' ')};
`
const ButtonRight = styled(Button)`
  border-radius: ${({ theme, hasCard }): string =>
    hasCard ? '0 1rem 1rem 0' : theme.spaceScale(1)};
  background-color: transparent;
`

interface Actions {
  add: (options?: any) => void
  update: (newQuantity: number, options?: any) => void
  remove: () => void
}

interface Quantities {
  quantity: number
  foil: number
}

interface ActionButtonProps {
  actions: Actions
  quantity: number
  collection?: Quantities
}

/**
 * Button group for updating card quantity.
 *
 * actions - Add/Update/Delete card action functions
 * quantity - The current card quantity within the scope
 * collection - The total cards in collection (only shows if collection is present)
 */
export const ActionButtons = ({
  actions,
  quantity,
  collection,
}: ActionButtonProps): ReactElement => (
  <Flex alignItems="center" justifyContent="end">
    {!!quantity && (
      <>
        <ButtonLeft
          color="grey"
          shade={8}
          size="small"
          variant="outline"
          bubble={false}
          isDisabled={!quantity}
          onClick={(): void => {
            const newQuantity = quantity - 1
            if (newQuantity) {
              actions.update(newQuantity)
            } else {
              actions.remove()
            }
          }}
        >
          <Feather icon="minus" size="tiny" />
        </ButtonLeft>
        <ButtonMiddle color="grey" shade={8} variant="outline" isDisabled>
          <Flex alignItems="center">
            <Text family="roboto" display="inline-block">
              {quantity}
            </Text>
            {collection && collection.quantity ? (
              <Text
                family="roboto"
                display="inline-block"
                color="grey"
                shade={6}
                size={2}
              >{`/${collection.quantity}`}</Text>
            ) : null}
          </Flex>
        </ButtonMiddle>
      </>
    )}
    <ButtonRight
      hasCard={quantity}
      color="grey"
      shade={8}
      size="small"
      bubble={false}
      variant="outline"
      onClick={(): void => {
        if (quantity) {
          actions.update(quantity + 1)
        } else {
          actions.add()
        }
      }}
    >
      <Feather icon="plus" size="tiny" />
    </ButtonRight>
  </Flex>
)
