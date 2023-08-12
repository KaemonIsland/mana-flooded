import { CardStats } from './CardStats'
import { Card } from './Card'

export interface Deck {
  id: number
  user_id?: number
  name?: string
  format?: string
  description?: string
  created_at?: string
  updated_at?: string
  colors?: Array<string>
  stats?: CardStats
  cards?: Array<Card>
}
