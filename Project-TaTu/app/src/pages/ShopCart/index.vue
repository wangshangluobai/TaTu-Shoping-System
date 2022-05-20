<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="goods in shopCartList" :key="goods.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="goods.isChecked"
              @change="changeCheck(goods, $event)"
            />
            <!-- goods.isChecked==1 -->
          </li>
          <li class="cart-list-con2">
            <img :src="goods.imgUrl" />
            <div class="item-msg">{{ goods.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ goods.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('minus', -1, goods)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="goods.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value * 1, goods)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('plus', 1, goods)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ goods.skuPrice * goods.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteGoods(goods.skuId)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllCheck&&shopCartList.length>0"
          @click="checkAll"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllChecked">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ tatol }}</i>
        </div>
        <div class="sumbtn">
          <!-- 编程式导航 -->
          <a class="sum-btn" @click="$router.push('/trade')">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 节流
import throttle from "lodash/throttle";
import { mapGetters } from "vuex";
export default {
  name: "ShopCart",
  mounted() {
    this.getShopCartData();
  },
  computed: {
    // 从仓库获取数据
    ...mapGetters(["cartList"]),
    // 进一步简化数据
    shopCartList() {
      return this.cartList.cartInfoList || [];
    },
    // 总计金额
    tatol() {
      let num = 0;
      this.shopCartList.forEach((e) => {
        // console.log(e.)
        num += e.skuNum * e.skuPrice;
      });
      return num;
    },
    // 检测商品选中状态
    isAllCheck() {
      /* 这里可能出现问题 */
      return this.shopCartList.every((e) => e.isChecked);
    },
  },
  methods: {
    getShopCartData() {
      // 获取购物车数据
      this.$store.dispatch("getShopCart");
    },
    handler: throttle(async function (type, disNum, goods) {
      switch (type) {
        case "minus":
          // skuNum不能为小于1
          disNum = goods.skuNum > 1 ? -1 : 0;
          break;
        case "plus":
          disNum = 1;
          break;
        case "change":
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            disNum = parseInt(disNum) - goods.skuNum;
          }
          break;
      }
      try {
        await this.$store.dispatch("sendUpdateShopCart", {
          skuId: goods.skuId,
          skuNum: disNum,
        });
        this.getShopCartData();
        console.log("数据修正", type, goods.skuNum);
      } catch (error) {
        alert(error.data);
      }
    }, 1000),
    /* // type 为了区分三种途径  disNum +变化量+1 -变化量-1 input最终的值(非变化量)  cart 点击的是谁
    async handler(type, disNum, goods) {
      switch (type) {
        case "minus":
          // skuNum不能为小于1
          disNum = goods.skuNum > 1 ? -1 : 0;
          break;
        case "plus":
          disNum = 1;
          break;
        case "change":
          if(isNaN(disNum)||disNum<1){
            disNum = 0;
          }else{
            disNum = parseInt(disNum)-goods.skuNum;
          }
          break;
      };
      try {
        await this.$store.dispatch("sendUpdateShopCart", {
          skuId: goods.skuId,
          skuNum: disNum,
        });
        this.getShopCartData();
        console.log("数据修正", type, goods.skuNum, );
      } catch (error) {
        alert(error.data);
      }
    }, */
    async deleteGoods(skuId) {
      try {
        await this.$store.dispatch("deleteCartGoodsBySkuId", skuId);
        this.getShopCartData();
      } catch (error) {
        alert(error);
      }
    },
    async changeCheck(goods, event) {
      try {
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("changeGoodsCheck", {
          skuId: goods.skuId,
          isChecked,
        });
        this.getShopCartData();
      } catch (error) {
        alert(error.message);
      }
    },
    // 一次性删除目前处于选中状态的商品
    async deleteAllChecked() {
      try {
        await this.$store.dispatch("deleteChecked");
        this.getShopCartData();
      } catch (error) {
        alert(error.message);
      }
    },
    async checkAll(event) {
      try {
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("checkAllGoods", isChecked);
        this.getShopCartData();
      } catch (error) {
        alert(error.message)
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>