import http from "../http-common"

class UploadFilesService {
    async uploadImage(files, to) {
        let requests = [];
        let url = null;
        switch (to) {
            case 'new':
                url = '/newimage/'
                break
            // case 'carousel':
            //     url = '/carouselimage/'
            //     await this.fixCarousel(files.length)
            //     break
            case 'project':
                url = '/projectimage/'
                break
        }
        // if (to === 'carousel') {
        //     for (let x = 0; x < files.length; x++) {
        //         let formData = new FormData();
        //         formData.append('image', files[x]); // 直接將圖片文件添加到 FormData 中
        //         formData.append('order', x + 1); // 添加 order 屬性
        //         // console.log(files[x])
        //         // console.log(x + 1)
        //         let request = http.post(url, formData, {
        //             headers: {
        //                 "Content-Type": "multipart/form-data"
        //             }
        //         });
        //         requests.push(request);
        //     }
        //     // new, project
        // } else {
            for (let x = 0; x < files.length; x++) {
                let formData = new FormData();
                formData.append("image", files[x]);
                // console.log(files[x])
                let request = http.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                requests.push(request);
            }
        // }    
        return Promise.all(requests);
        
    }
    // // carousel order處理，讓新加入的排前面
    // async fixCarousel(shift) {
    //     return http.get('get_valid_carousel?source=back')
    //         .then(response => {
    //             const carouselNeedFixOrder = response.data
    //             // console.log(carouselNeedFixOrder)
    //             let requests = []
    //             for (let x = 0; x < carouselNeedFixOrder.length; x++) {
    //                 let request = http.patch('/carouselimage/' + carouselNeedFixOrder[x].id + '/', {
    //                     'order': carouselNeedFixOrder[x].order + shift
    //                 }, {
    //                     'headers': {
    //                         "Content-Type": "multipart/form-data"
    //                     }
    //                 })
    //                 requests.push(request)
    //             }
    //             return Promise.all(requests)
    //         })
    //         .catch(error => console.log(error))
    // }
}

export default new UploadFilesService();