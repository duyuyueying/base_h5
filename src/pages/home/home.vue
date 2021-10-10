<template>
  <div>Home</div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations} from 'vuex'
export default Vue.extend({
  created() {
    
  },
  computed: {
    ...mapState(['address']),
  },
  methods:{
    ...mapMutations(['SET_ADDRESS'])
  },
  mounted(){
    this.SET_ADDRESS('test')
  }
})
</script>

<style>

</style>