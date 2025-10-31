<template>
  <td :colspan="colspan" class="text-center py-4">
    <span class="fw-normal" :class="textClass">
      {{ message }}
    </span>
    <slot></slot> <!-- Pour ajouter du contenu supplémentaire si besoin -->
  </td>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyTableMessage',
  props: {
    colspan: {
      type: Number,
      default: 8
    },
    message: {
      type: String,
      default: 'Aucune donnée disponible'
    },
    textClass: {
      type: String,
      default: ''
    }
  }
});
</script>