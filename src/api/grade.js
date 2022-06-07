import instance from '@/api/index'
let preUrlPath = "/Grade/";

const GetGrade = {
    r: (params) => {
        return instance.get(`${preUrlPath}GetGrade/${params}`)
    }
}

const SaveGrade = {
    r: (params) => {
        return instance.post(`${preUrlPath}SaveGrade`, params)
    }
}

const DeleteGrade = {
    r: (params) => {
        return instance.delete(`${preUrlPath}DeleteGrade/${params}`)
    }
}

const FindGrade = {
    r: (params) => {
        return instance.get(`${preUrlPath}FindGrade/${params}`)
    }
}

const GetAllGrade = {
    r: () => {
        return instance.get(`${preUrlPath}GetAllGrade`)
    }
}

const Test = {
    r: () => {
        return instance.get(`/Billed/GetNegotiatedPriceVendor`)
    }
}

export {
    GetGrade,
    SaveGrade,
    DeleteGrade,
    FindGrade,
    GetAllGrade,
    Test
}