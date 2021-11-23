<template>
  <div class="template">

  </div>
</template>

<script>
  export default SysComponent({
    API: ['setData', 'getData'],
    name: 'template',
    components: {},
    props: [],
    data () {
      return {}
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
      getData () {
        let res = {};
        return res;
      },
      setData (data) {
        console.log(data)
      }
    },
    destroyed () {}
  })
</script>

<style lang="scss" scoped>
  .template {

  }
</style>