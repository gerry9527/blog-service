/**
 * 参数合法性校验类
 */
class ParamsValidate {
    constructor () {
        // 参数校验列表
        this.validateList = []
    }

    add (obj) {
        this.validateList.push(obj)
    }

    remove (index) {
        this.validateList.splice(index, 1)
    }

    execute () {
        this.validateList.forEach(vv => {
            
        })
    }
}
