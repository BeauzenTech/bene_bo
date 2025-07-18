<template>
  <div class="category-navigation">
    <div class="category-grid">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="['category-card', { active: selectedCategory === category.id }]"
        @click="$emit('category-change', category.id)"
      >
        <div class="category-icon">
          <i :class="getCategoryIcon(category.id)"></i>
        </div>
        <div class="category-info">
          <h3 class="category-name">{{ category.name }}</h3>
          <span class="category-count">{{ category.itemCount }} Menu In Stock</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '../types'

interface Props {
  categories: Category[]
  selectedCategory: string
}

defineProps<Props>()

defineEmits<{
  'category-change': [categoryId: string]
}>()

const getCategoryIcon = (categoryId: string): string => {
  const icons: Record<string, string> = {
    breakfast: 'fas fa-bacon',
    lunch: 'fas fa-hamburger', 
    dinner: 'fas fa-drumstick-bite',
    soup: 'fas fa-soup',
    desserts: 'fas fa-ice-cream',
    sidedish: 'fas fa-pepper-hot',
    appetizer: 'fas fa-shrimp',
    beverages: 'fas fa-glass-cheers'
  }
  return icons[categoryId] || 'fas fa-utensils'
}
</script>

<style lang="scss" scoped>
.category-navigation {
  margin-bottom: 2rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  min-height: 80px;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  &.active {
    background: #3b82f6;
    border-color: #3b82f6;
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
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #3b82f6;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.category-info {
  flex: 1;

  .category-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
    transition: color 0.2s ease;
  }

  .category-count {
    font-size: 12px;
    color: #64748b;
    transition: color 0.2s ease;
  }
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .category-card {
    padding: 12px;
    min-height: 70px;

    .category-icon {
      width: 40px;
      height: 40px;
      font-size: 18px;
    }

    .category-info {
      .category-name {
        font-size: 14px;
      }

      .category-count {
        font-size: 11px;
      }
    }
  }
}

@media (max-width: 480px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style> 