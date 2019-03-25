/**
 * 服务端返回消息
 */
class Message {
    constructor(msg, code, content) {
        this.msg = msg;
        this.code = code || 0;
        this.content = content;
    }

    getMsg() {
        return this.msg;
    }
    setMsg(value) {
        this.msg = value;
    }
    getCode() {
        return this.code;
    }
    setCode(value) {
        this.code = value;
    }
    getContent() {
        return this.content;
    }
    setContent(value) {
        this.content = value;
    }
}

module.exports = Message;