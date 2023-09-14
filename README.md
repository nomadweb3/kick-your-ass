# kick-your-ass

## 为什么在 IC 上做？

1. 用户没有门槛，不需要持有 icp
    
2. 扩展性很好，fully on-chain
    
3. 用户群体很广，twitter handle
    
4. ranking，趣味性，
    
    1. 喜欢
        
    2. annoy
        
5. 导入twitter 人物，免费
    
    1. 每个人每一天只有3次kick的权力，如果需要更多，你可以通过icp/btc/eth/usdt 买更多kick的权力，便宜
        
6. sharing
    
    1. NFT
        

## 产品需求
我想做一个纯前端的产品，产品需求如下，帮我生成npm项目的全部代码，要求是提供运行的一步步how to run 的指导，让我在本地的3000端口可以调试

- 用户进入网页后，有一个漂亮的按钮A可以点击导入twitter handle
    
    - 当用户输入点击按钮A时，会导入他输入的twitter handle的头像和账号名字，此时网页上自动生成一个卡通人物，人物的头就是刚才fetch到的twitter 头像，人物的屁股比较大，看起来非常Q弹，一颤一颤的动画效果。
        
    - 如果用户输入的 twitter handle已经被别的用户提前导入过了，那么就导入的按钮就是灰色的，不能继续点击，卡通人物也直接出现在网页上
        
- 卡通人物生成后，人物下方有两个按钮，一个是 Kick ass，一个是kiss face。
    
    - 如果点击kick ass的按钮，就会凭空出现一个大脚踢一下卡通人物的屁股
        
    - 如果点击kick ass的按钮，就会凭空出现一个美唇亲一下卡通人物的侧脸
        
- 对于每一个卡通人物的twitter handle，都需要记录总的kick数和kiss数，然后网页上面的第二个tab就是ranking，有两种ranking，
    
    - 第一种是按照kick数从大到小将twitter handle做一个排序，
        
    - 第二种是按照kiss数从大到小将twitter handle做一个排序，
        
## Dev Milestone
- 8号6PM，框架，配置化，metrics导出（prometheus， canister内存）
    
- 15号6PM，替换成熟的功能（导入twitter，卡通人物，动画效果），成熟的产品
    
- 18号，beta 测试，寻求反馈，迭代
    
- 25号
    
## Hackthon
- 对于hackthon而言，
    
    - 评判标准，往上靠
        
    - MVP（五脏俱全）
        
    - roadmap
        
- 项目
    
    - idea
        
    - 产品功能/原型图
        
    - 前后端
        
        - 数据结构
            
        - 前后端交互标准
            
        - 功能优先级/依赖关系
            
    - integration testing, testnet
        
    - 试玩，beta，feedback
        
    - loop

## 开发相关

- 点击的数据存储在后端canister中

- 需要记录每天用户已经点击过的次数， 以及每天后清空

https://xavue-zaaaa-aaaan-qa24a-cai.icp0.io/

https://www.a4z.cn/fe/2019/09/12/three-js-3d-anime/

https://threejs.org/examples/#webgl_loader_collada_skinning

twitter api : https://rapidapi.com/zh/omarmhaimdat/api/twitter154/