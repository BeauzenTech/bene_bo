<template>
  <div class="category-navigation">
    <h2 class="categories-title">Liste des catégories</h2>
    <div class="category-grid">
      <button v-for="category in sortedCategories" :key="category.id"
        :class="['category-card', { active: selectedCategory === category.id }]"
        @click="$emit('category-change', category.id)">
        <div class="category-icon">
          <span class="emoji-icon">{{ getCategoryIcon(category.id) }}</span>
        </div>
        <div class="category-info">
          <h3 class="category-name">{{ category.name.charAt(0).toUpperCase() + category.name.slice(1) }}</h3>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '../types'

interface Props {
  categories: Category[]
  selectedCategory: string
}

const props = defineProps<Props>()

defineEmits<{
  'category-change': [categoryId: string]
}>()

const sortedCategories = computed(() => {
  return [...(props.categories || [])].sort((a, b) => Number(a.ordered) - Number(b.ordered))
})

const getCategoryIcon = (categoryId: string): string => {
  // Utiliser des emojis au lieu d'icônes FontAwesome pour éviter les dépendances
  const icons: Record<string, string> = {
    // Catégories VaBene
    '0f142654-3109-4dcb-89d3-6b89b8eca35e': '🍝', // Pâtes
    'aa5474aa-578e-4d0a-81b1-de15166a8766': '🥗', // Salades
    'fddfda10-5cac-428b-9cb1-d6237258348c': '🍕', // Pizza
    'bb9505b5-e5a8-4455-b53c-8cdca5c1ea98': '🥪', // Sandwich
    'bb775c39-716f-4265-835c-c1b7bf2e29c0': '🥤', // Boisson
    '1fc62599-32b9-4a98-859d-b9f27fdf9d57': '🍰', // Dessert
    '4153440b-4048-4193-9d04-60d6f51ea19e': '🥟', // Panzerotti
    'a06fa469-caa2-4c17-a4b7-0141d6eb66c9': '🍤', // Entrée
    'fd4a2c4e-49ef-48a5-9937-6f3a51122f9e': '🍕', // Pizza personnalisée
    // Anciennes catégories pour compatibilité
    breakfast: '🥓',
    lunch: '🍔',
    dinner: '🍗',
    soup: '🍲',
    desserts: '🍦',
    sidedish: '🌶️',
    appetizer: '🍤',
    beverages: '🍷'
  }
  return icons[categoryId] || '🍽️'
}
</script>

<style lang="scss" scoped>
.category-navigation {
  margin-bottom: 1rem;
}

.categories-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  text-align: left;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.85rem;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  min-height: 56px;

  &:hover {
    border-color: #388D35;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  &.active {
    background: #388D35;
    border-color: #388D35;
    color: white;

    .category-icon {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .category-info {
      .category-name {
        color: white;
      }

      .category-count {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.category-icon {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #388D35;
  flex-shrink: 0;
  transition: all 0.2s ease;

  .emoji-icon {
    font-size: 18px;
    display: block;
    line-height: 1;
  }
}

.category-info {
  flex: 1;

  .category-name {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    transition: color 0.2s ease;
    line-height: 1.2;
  }

  .category-count {
    font-size: 12px;
    color: #64748b;
    transition: color 0.2s ease;
  }
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .category-card {
    padding: 8px 10px;
    min-height: 50px;
    gap: 6px;

    .category-icon {
      width: 32px;
      height: 32px;
      font-size: 14px;

      .emoji-icon {
        font-size: 16px;
      }
    }

    .category-info {
      .category-name {
        font-size: 13px;
      }
    }
  }
}

@media (max-width: 480px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-card {
    padding: 6px 8px;
    min-height: 44px;

    .category-icon {
      width: 28px;
      height: 28px;

      .emoji-icon {
        font-size: 14px;
      }
    }

    .category-info {
      .category-name {
        font-size: 12px;
      }
    }
  }
}
</style>