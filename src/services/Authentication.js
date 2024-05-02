class Authentication {
    // read(permission) {

    // }
    add(permission) {
        if (permission.includes('新增')) {
            return true
        }
        return false
    }
    modify(permission) {
        if (permission.includes('修改')) {
            return true
        }
        return false
    }
    delete(permission) {
        if (permission.includes('刪除')) {
            return true
        }
        return false
    }
    admin(permission) {
        if (permission.includes('管理')) {
            return true
        }
        return false
    }
}

export default new Authentication