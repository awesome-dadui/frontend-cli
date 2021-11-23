<template>
  <item :key="model.name"
        v-bind="itemAttributes"
        @changed="onChangeValue">
    <slot name="inner"></slot>
  </item>
</template>

<script>
  function getItemAttributes (item) {
    let {
      required = false,
      disabled,
      clearable = true,
      node,
      type,
      name,
      label,
      placeholder,
      suffix,
      value,
      min,
      max,
      tips = '',
    } = item;

    let model = {
      required,
      disabled,
      node,
      name,
      label,
      value,
      tips,
    };

    window.CDEBUG && (model.label += name);

    // console.log(model, model.label, model.name)

    switch (model.node) {
      case "input":
        model.type = type || 'text';
        model.suffix = suffix;
        model.placeholder = placeholder;

        if (min !== undefined) model.min = min;
        if (max !== undefined) model.max = max;
        break;
      case 'radio':
        model.data = item.data || item.options;
        break;
      case 'checkbox':
        model.data = item.data || item.options;

        model.value = (model.value === ''
          ? []
          : (typeof model.value === 'string'
            ? model.value.split(',')
            : model.value));
        break;
      case 'select':
        model.data = item.data || item.options;
        break;
      case 'time-picker':
      case 'date-picker':
        if (model.value === '')
          model.value = []

        model.type = type;
        model.clearable = clearable;
        model.placeholder = placeholder;
        break;
      case 'switch':
        if (typeof model.value !== 'boolean')
          model.value = Boolean(Number(model.value));
        break;
      case 'upload':
        if (model.value === '')
          model.value = []

        model.type = type;
        break;
    }

    return model
  }

  export default SysComponent({
    name: "c-item3",
    components: {},
    inject: {
      ijcontainer: {
        default: () => ({}),
      },
    },
    props: {
      model: Object,
    },
    data () {
      let {uploadImageURL} = this.$root;
      let itemAttributes = getItemAttributes(this.model);
      if (itemAttributes.node === 'upload') {
        itemAttributes.action = uploadImageURL;
        itemAttributes.beforeRender = this.onBeforeRenderHandler;
        itemAttributes.beforeRequest = this.onBeforeRequestHandler;
        // console.log(itemAttributes)
      }
      // console.log('itemAttributes:', itemAttributes);

      return {
        itemAttributes,
      }
    },
    watch: {
      [`model.disabled`] (newVal, oldVal) {
        this.itemAttributes.disabled = newVal;
      },
      [`model.value`] (newVal, oldVal) {
        console.log('model.value newVal:', newVal, 'oldVal:', oldVal);
        this.itemAttributes.value = newVal;
      },
    },
    methods: {
      onChangeValue (newVal, select) {
        // console.log('oldVal:', this.model.value);
        // console.log('onChangeValue:', newVal, select);

        let {name, type} = this.itemAttributes;
        // console.log(name, type)

        // 数字类型输入框，保留小数点后precision位
        if (type === 'number' && this.model.precision) {
          // 截取小数点后几位
          // newVal = newVal.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
          let index = newVal.indexOf('.');
          if (index != -1) {
            newVal = newVal.substring(0, (index + 1) + this.model.precision);
          }
          // console.log('after newVal:', newVal);
          this.ijcontainer.vm.innerComps.get(this.model.name).$setModel(newVal, false);
        }

        // 当前录入项赋值
        this.model.value = newVal;
      },
      onBeforeRenderHandler (res) {
        // console.log('onBeforeRenderHandler:', res)
        return {code: '0000', data: res.data.accessLogoUrl};
      },
      onBeforeRequestHandler (file, fileInfo) {
        console.log('onBeforeRequestHandler:', file, fileInfo)
        let {imageHeight, imageWidth} = fileInfo

        return new Promise((resolve, reject) => {
          if (file.file.size / 1024 > 30) {
            reject({msg: '文件大小不能超过30KB'})
            return
          }

          if (imageWidth >= 1000 || imageHeight >= 1000) {
            reject({msg: '展示内容图尺寸应为：宽度小于1000/高度小于1000'})
            return
          }

          resolve(file)
        })
      },
    }
  });
</script>