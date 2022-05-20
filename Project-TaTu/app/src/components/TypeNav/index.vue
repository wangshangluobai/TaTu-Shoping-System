<template>
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派|事件委托   leaveIndex -->
      <div @mouseleave="leaveShow" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="show">
            <div class="all-sort-list2" @click="goSearch">
              <!-- 一级分类 -->
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- :style="{display:currentIndex == index ? 'block':'none'}" -->
                <div class="item-list clearfix" v-show="currentIndex == index">
                  <!-- 二级分类 -->
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild.slice(0, 10)"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <!-- 三级分类 -->
                        <em
                          v-for="c3 in c2.categoryChild.slice(0, 6)"
                          :key="c3.categoryId"
                        >
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
// 按需引入
import throttle from "lodash/throttle";

import { mapState } from "vuex";
export default {
  name: "TypeNav",
  data() {
    return {
      currentIndex: -1,
      show: true,
    };
  },
  // 组件挂载完毕 可以向服务器发请求
  mounted() {
    // 当组件挂在完毕让show属性变为false
    // 如果不是Home路由组件 将Typenav隐藏
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  computed: {
    ...mapState({
      // 右侧需要的是一个函数 当使用这个计算属性的时候 右侧函数会立即执行一次
      // 注入一个参数state 其实即为大仓库中的数据
      categoryList: (state) => state.home.categoryList.slice(0, 15),
    }),
  },
  methods: {
    // 鼠标进入修改相应数据currentIndex
    changeIndex: throttle(function (index) {
      // throttle 回调函数不要用箭头函数 可能出现this指向问题
      // index 鼠标移入某一个一级分类的元素的索引值
      // 正常情况(用户慢慢的操作) 鼠标进入 每一个一级分类h3 都会触发鼠标进入事件
      // 非正常情况(用户操作很快) 本身全部的一级分类应该触发鼠标进入事件 但是经过测试 只有部分h3触发了
      // 就是由于用户行为过快 导致浏览器反应不过来 如果当前回调函数中有大量业务 有可能出现卡顿现象
      this.currentIndex = index;
    }, 50),
    leaveIndex() {
      this.currentIndex = -1;
    },
    goSearch(event) {
      // 最好的解决方案 编程式导航+ 事件委派
      // 存在一些问题 事件委派 是把所有全部的子节点的事件委派给父节点
      // 点击a标签的时候 才会进行路由跳转 怎么能确定点击的一定是a标签
      // 存在另外一个问题 即便能确认点击的是a标签 如何区分一级 二级 三级分类的标签

      // 第一个问题 把子节点当中a标签 加上自定义属性 data-categoryName 其余节是没有的
      let element = event.target;
      // 获取到当前触发这个事件的节点 需要带有 data-categoryName 这样节点
      // 节点有一个属性dataset属性 可以获取节点的自定义属性与属性值
      let { categoryname, category1id, category2id, category3id } =
        element.dataset;
      // 如果标签身上有 categoryName 一定是a标签
      if (categoryname) {
        // 整理路由跳转的参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 一级 二级 三级 分类的a标签
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        /* 判断 如果路由跳转时 有params有参数 则加入 */
        if(this.$route.params){
          location.params = this.$route.params
          // 整理完参数
          location.query = query;
          // 路由跳转
          this.$router.push(location);
        }
      }
    },
    enterShow() {
      this.show = true;
    },
    leaveShow() {
      this.currentIndex = -1;
      // 判断如果是search路由组件才执行
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            // display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background-color: tomato;
        }
      }
    }
    /* 过渡动画样式 */
    /* 过渡动画开始 */
    .sort-enter{
      height: 0;
    }
    /* 过渡动画结束 */
    .sort-enter-to{
      height: 461px;
    }
    /* 定义时间、速度 */
    .sort-enter-active{
      transition: all .1s linear;
    }
  }
}
</style>