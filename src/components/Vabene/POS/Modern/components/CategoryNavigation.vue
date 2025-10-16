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
  console.log('📋 CategoryNavigation - Catégories reçues:', props.categories);
  const sorted = [...(props.categories || [])].sort((a, b) => Number(a.ordered) - Number(b.ordered));
  console.log('📋 CategoryNavigation - Catégories triées:', sorted);
  return sorted;
})

const getCategoryIcon = (categoryId: string): string => {
  // Trouver la catégorie par son ID
  const category = props.categories.find(cat => cat.id === categoryId)
  if (!category) return '🍽️'
  
  // Utiliser le nom de la catégorie pour déterminer l'icône
  const categoryName = category.name.toLowerCase()
  
  // Mapping basé sur les noms de catégories (plus robuste)
  const iconMap: Record<string, string> = {
    // Catégories principales
    'pâtes': '🍝',
    'pasta': '🍝',
    'salades': '🥗',
    'salad': '🥗',
    'pizza': '🍕',
    'pizzas': '🍕',
    'sandwich': '🥪',
    'sandwiches': '🥪',
    'boisson': '🥤',
    'boissons': '🥤',
    'beverages': '🥤',
    'dessert': '🍰',
    'desserts': '🍰',
    'panzerotti': '🥟',
    'entrée': '🍤',
    'entrées': '🍤',
    'appetizer': '🍤',
    'appetizers': '🍤',
    
    // Anciennes catégories pour compatibilité
    'breakfast': '🥓',
    'lunch': '🍔',
    'dinner': '🍗',
    'soup': '🍲',
    'sidedish': '🌶️',
    'side dish': '🌶️',
    'plats': '🍽️',
    'dishes': '🍽️',
    'menu': '🍽️'
  }
  
  // Chercher une correspondance exacte ou partielle
  for (const [key, icon] of Object.entries(iconMap)) {
    if (categoryName.includes(key) || key.includes(categoryName)) {
      return icon
    }
  }
  
  // Icône par défaut si aucune correspondance
  return '🍽️'
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