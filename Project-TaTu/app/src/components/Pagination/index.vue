<template>
  <div class="pagination">
    <button :disabled='pageNo==1' @click="$emit('getPageNo',pageNo-1)">上一页</button>
    <button v-if="startNumAndEndNum.start>1" @click="$emit('getPageNo',1)" :class="{active:pageNo==1}">1</button>
    <button v-if="startNumAndEndNum.start>2">···</button>
    <!-- 中间部分 -->
    <template v-for="(page,index) in startNumAndEndNum.end" >
      <button :key="index" v-if='page >= startNumAndEndNum.start' @click="$emit('getPageNo',page)" :class="{active:pageNo==page}">{{page}}</button>
    </template>
    <button v-if="startNumAndEndNum.end<totalPage-1">···</button>
    <button v-if="startNumAndEndNum.end<totalPage" @click="$emit('getPageNo',totalPage)" :class="{active:pageNo==totalPage}">{{totalPage}}</button>
    <button :disabled='pageNo==totalPage' @click="$emit('getPageNo',pageNo+1)">下一页</button>

    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  data() {
    return {}
  },
  props:['pageNo','pageSize','total','continues'],
  computed:{
    // 总页数
    totalPage(){
      // 向上取整
      return Math.ceil(this.total/this.pageSize);
    },
    startNumAndEndNum(){
      // 集中引用外部数据
      const{pageNo,totalPage,continues} = this;
      // 初始化start|end的值
      let start =0, end =0;
      // 当数据过少 连续页码大于总页码 
      if(continues>totalPage){
        // 开始值应修正为1
        start = 1,
        // 结束值应以总页码为准
        end = totalPage
        // 总页码 大于 等于 连续页码  可以完整显示连续页码
      }else{
        // 初始值为当前页码 减去 连续页码的一半(由于连续页码为奇数，向下取整)
        start = pageNo-parseInt(continues/2);
        // 同上
        end = pageNo+parseInt(continues/2);
        // 当前页码靠前 初始值经计算小于1
        if(start<1){
          // 修正初始值为1
          start = 1,
          // 修正结束值为连续页码
          end = continues
        }
        // 当前页码靠后 结束之经计算大于总页码
        if(end>totalPage){
          // 初始值为 总页码 减去 连续页码 +1
          start = totalPage-continues+1,
          end = totalPage
        }
      }
      return {start,end};
    }
  },
  mounted() {
    
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: tomato;
      color: #fff;
    }
  }
}
</style>