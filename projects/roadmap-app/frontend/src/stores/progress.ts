import { defineStore } from 'pinia'
import api from '@/services/api'

export const useProgressStore = defineStore('progress', {
  state: () => ({
    checkedItems: [] as string[]
  }),

  actions: {
    async loadProgress() {
      const res = await api.get('/progress')

      this.checkedItems = res.data
        .filter((p: any) => p.completed)
        .map((p: any) => p.itemId)
    },

    async toggleItem(itemId: string) {
      const exists = this.checkedItems.includes(itemId)

      if (exists) {
        this.checkedItems = this.checkedItems.filter(
          i => i !== itemId
        )
      } else {
        this.checkedItems.push(itemId)
      }

      await api.post('/progress', {
        itemId,
        completed: !exists
      })
    }
  }
})
