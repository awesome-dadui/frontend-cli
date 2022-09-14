import citem from './c-item';
import {listApi} from "../../../api2/index";

let {getPath, getActivityList, getRemoveActivity, getStopActivity, getSubmitActivity} = listApi;

let EnumTitle = {
  orderComplete: "订单完成返奖",
  dshop: "页面领奖",
  login: "会员登录有礼",
  lottery: "大转盘抽奖",
  orderPay: "支付完成返奖",
  rate: "订单评价有礼",
  register: "会员注册有礼",
  wareCoupon: "固定位置领券",
  offlineLottery: "门店抽奖"
}

export default XPage({
  components: {
    'c-item': citem
  },
  data: {
    actname: '',
    config: {
      title: '',
      head: {
        form: [
          {
            "label": "活动id",
            "node": "input",
            "name": "id",
            "placeholder": "输入活动id",
            "value": ""
          },
          {
            "label": "活动状态",
            "node": "select",
            "name": "status",
            "data": [
              {label: '全部', value: null},
              {label: '创建中', value: 1},
              {label: '审核中', value: 2},
              {label: '审核通过', value: 3},
              {label: '审核拒绝', value: 4},
              {label: '进行中', value: 6},
              {label: '已结束', value: 7},
              {label: '已终止', value: 8}
            ],
            "value": null
          },
          {
            "label": "活动时间",
            "name": "activityDate"
          },
          {
            "label": "创建人",
            "node": "input",
            "name": "creator",
            "value": null
          },
        ]
      },
      table: {
        ajax: {
          url: ''
        },
        thead: [
          {label: '活动id', key: 'id'},
          {label: '活动名称', key: 'name'},
          {
            label: '活动时间',
            text: (rowData) => {
              // console.log('rowData:', rowData)
              const {duration = {}, relativeTimeLimit = {}} = rowData;
              const {startTime, endTime} = duration;

              const getDisplayActivityDate = ([startTime, endTime], {hasLimit = false, monthLimit, weekLimit}) => {
                const FMT = 'YYYY-MM-DD HH:mm:ss';
                let relativeTimeStr = '';
                if (hasLimit) {
                  const isWeekLimit = weekLimit && weekLimit.length || false;
                  const prefix = isWeekLimit ? "每周" : "每月";
                  const computedDate = isWeekLimit ? weekLimit.join(',') : monthLimit.join(',');
                  const suffix = "";
                  relativeTimeStr = ` ${prefix}${computedDate}${suffix}`;
                }
                return `${moment(startTime).format(FMT)} ~ ${moment(endTime).format(FMT)}${relativeTimeStr}`;
              }

              return getDisplayActivityDate([startTime, endTime], relativeTimeLimit);
            }
          },
          {
            label: '活动状态',
            status: (status) => [null, "default", "default", "success", "danger", "danger", "success", "info", "info"][status],
            text: (status) => [null, "创建中", "审核中", "审核通过", "审核拒绝", "创建失败", "进行中", "已结束", "已终止"][status],
          },
          {label: '创建时间'},
          {label: '创建人', key: 'creator'},
          {
            label: '操作',
            getButtons (rowData) {
              // console.log('rowData:', rowData)
              let {hasOp, status} = rowData;
              let {actname = 'offlineLottery'} = kayak.router.requestParam;
              let buttons = [];
              let frontShow = (actname === 'dshop' || actname === 'lottery' || actname === 'wareCoupon' || actname === 'offlineLottery')

              if (status === 1) { // 创建中
                hasOp && buttons.push({type: 'edit', text: '编辑'});
                hasOp && buttons.push({type: 'submit', text: '提审'});
                hasOp && buttons.push({type: 'copy', text: '复制'});
                hasOp && frontShow && buttons.push({type: 'frontShow', text: '前端展示'});
                hasOp && buttons.push({type: 'remove', text: '删除'});
              } else if (status === 2) { // 审核中
                buttons.push({type: 'view', text: '查看'});
                hasOp && buttons.push({type: 'copy', text: '复制'});
                hasOp && frontShow && buttons.push({type: 'frontShow', text: '前端展示'});
                hasOp && buttons.push({type: 'remove', text: '删除'});
              } else if (status === 3) { // 审核通过
                buttons.push({type: 'view', text: '查看'});
                hasOp && buttons.push({type: 'rewardEdit', text: '奖励调整'});
                hasOp && buttons.push({type: 'copy', text: '复制'});
                hasOp && frontShow && buttons.push({type: 'frontShow', text: '前端展示'});
                hasOp && buttons.push({type: 'stop', text: '终止'});
              } else if (status === 4) { // 审核拒绝
                hasOp && buttons.push({type: 'edit', text: '编辑'});
                hasOp && buttons.push({type: 'submit', text: '提审'});
                hasOp && buttons.push({type: 'copy', text: '复制'});
                hasOp && frontShow && buttons.push({type: 'frontShow', text: '前端展示'});
                hasOp && buttons.push({type: 'remove', text: '删除'});
              } else if (status === 5) { // 创建失败
                buttons.push({type: 'view', text: '查看'});
                hasOp && buttons.push({type: 'remove', text: '删除'});
              } else if (status === 6) { // 进行中
                buttons.push({type: 'view', text: '查看'});
                buttons.push({type: 'analysis', text: '数据'});
                hasOp && buttons.push({type: 'rewardEdit', text: '奖励调整'});
                hasOp && frontShow && buttons.push({type: 'frontShow', text: '前端展示'});
                hasOp && buttons.push({type: 'stop', text: '终止'});
                hasOp && buttons.push({type: 'copy', text: '复制'});
              } else if (status === 7 || status === 8) { // <!--7已结束--> <!--8已终止-->
                buttons.push({type: 'view', text: '查看'});
                buttons.push({type: 'analysis', text: '数据'});
                hasOp && buttons.push({type: 'copy', text: '复制'});
              }

              return buttons;
            }
          }
        ]
      }
    },
  },
  show () {
    let {actname = 'offlineLottery'} = kayak.router.requestParam;
    let title = EnumTitle[actname];
    this.setData({
      actname,
      'config.title': title,
      'config.table.ajax': {url: getPath(actname)}
    })

    this.reload();
  },
  tableBeforeRequest (param) {
    return param;
  },
  onClickOperation (type, id) {
    let actname = this.data.actname;
    if (type === 'remove') {
      CabinX.confirm('确认删除？', (val) => {
        if (!val) return
        getRemoveActivity(actname, {
          activityId: id
        }).then((res) => {
          if (res && res.code === '0000') {
            CabinX.notice({
              text: '删除成功',
              status: 'success'
            });
            this.reload();
          }
        });
      });
    } else if (type === 'submit') {
      CabinX.confirm('确认提审？', (val) => {
        if (!val) return
        getSubmitActivity(actname, {
          activityId: id
        }).then((res) => {
          if (res && res.code === '0000') {
            CabinX.notice({
              text: '提交成功',
              status: 'success'
            });
            this.reload();
          }
        });
      });
    } else if (type === 'stop') {
      CabinX.confirm('确认终止？', (val) => {
        if (!val) return
        getStopActivity(actname, {
          activityId: id
        }).then((res) => {
          if (res && res.code === '0000') {
            CabinX.notice({
              text: '提交成功',
              status: 'success'
            });
            this.reload();
          }
        });
      });
    } else if (type === 'analysis') {
      CabinX.go(`#index/basicmarketingpage/analysis:activityId=${id}`);
    } else {
      CabinX.go(`#index/basicmarketingpage/public/activity:actname=${actname}&type=${type}${id ? '&id=' + id : ''}`);
    }
  },
  reload () {
    let data = this.getComponent('form').getData();
    this.search(data);
  },
  search (value) {
    console.log('search value:', value);
    value.startTime = null;
    value.endTime = null;
    let {activityDate} = value;
    if (activityDate && activityDate.form) {
      if (activityDate.form.startTime) {
        value.startTime = moment(activityDate.form.startTime).format("YYYY.MM.DD");
      }
      if (activityDate.form.endTime) {
        value.endTime = moment(activityDate.form.endTime).format("YYYY.MM.DD");
      }
      delete value.activityDate;
    }

    this.getComponent('table').query({params: value, url: this.data.config.table.ajax.url});
    // this.getComponent('table').query({params: value});
  },
  activityTimeBeforeRender (obj) {
    let string = '';
    if (obj && obj.form) {
      const {startTime, endTime} = obj.form;

      if (startTime) {
        string += moment(startTime).format("YYYY.MM.DD");
      } else {
        string += '不限';
      }
      if (endTime) {
        string += '-' + moment(endTime).format("YYYY.MM.DD");
      } else {
        string += '-不限';
      }
      if (!startTime && !endTime) {
        string = '';
      }
    }
    return string;
  },
});
