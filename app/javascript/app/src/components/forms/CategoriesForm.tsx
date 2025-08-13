import React, { useState, useEffect } from 'react'
import { Flex, Container } from '../../elements'

interface DeckedCardCategoriesFormProps {
  initialCategories: string[]
  onUpdateCategories: (newCategories: string[]) => void
}

export const CategoriesForm = ({
  initialCategories,
  onUpdateCategories,
}: DeckedCardCategoriesFormProps): React.ReactElement => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')

  console.log(categories)

  // Initialize local state from props
  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  // Update the parent whenever our local categories change.
  const updateCategories = (updated: string[]) => {
    setCategories(updated)
    onUpdateCategories(updated)
  }

  // Adds a new category if not empty and not already present.
  const handleAddCategory = () => {
    const trimmed = newCategory.trim()
    if (trimmed && !categories.includes(trimmed)) {
      const updated = [...categories, trimmed]
      updateCategories(updated)
      setNewCategory('')
    }
  }

  // Removes a category.
  const handleRemoveCategory = (cat: string) => {
    const updated = categories.filter((c) => c !== cat)
    updateCategories(updated)
  }

  // Reorders so that the selected category comes first.
  const handleMakeFirst = (cat: string) => {
    const updated = [cat, ...categories.filter((c) => c !== cat)]
    updateCategories(updated)
  }

  return (
    <Container padding={4}>
      <p bold>Decked Card Categories</p>
      {categories.map((cat, index) => (
        <Flex key={index} alignItems="center" justifyContent="space-between" marginY={2}>
          <p>{cat}</p>
          <Flex>
            {/* Button to move this category to the top */}
            <button onClick={() => handleMakeFirst(cat)} size="small">
              Make First
            </button>
            {/* Button to remove this category */}
            <button
              onClick={() => handleRemoveCategory(cat)}
              size="small"
              color="red"
              marginLeft={2}
            >
              Remove
            </button>
          </Flex>
        </Flex>
      ))}
      <Flex alignItems="center" marginTop={4}>
        <input
          label="New Category"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory} size="small" marginLeft={2}>
          Add Category
        </button>
      </Flex>
    </Container>
  )
}
