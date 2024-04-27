import http from "../http-common"

class UploadFilesService {
    uploadImage(files, to) {
        let requests = [];
        let url = null;
        switch (to) {
            case 'new':
                url = '/newimage/'
                break
            case 'carousel':
                url = '/carouselimage/'
                break
            case 'project':
                url = '/projectimage/'
                break
        }
        
        for (let x = 0; x < files.length; x++) {
            let formData = new FormData();
            formData.append("image", files[x]);

            let request = http.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            requests.push(request);
        }
        return Promise.all(requests);
    }
    // uploadNewImage(files) {
    //     let requests = [];
        
    //     for (let x = 0; x < files.length; x++) {
    //         let formData = new FormData();
    //         formData.append("image", files[x]);

    //         let request = http.post('/newimage/', formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data"
    //             }
    //         });
    //         requests.push(request);
    //     }
    //     return Promise.all(requests);
    // }
    // uploadCarouselImage(files) {
    //     let requests = [];
        
    //     for (let x = 0; x < files.length; x++) {
    //         let formData = new FormData();
    //         formData.append("image", files[x]);

    //         let request = http.post('/carouselimage/', formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data"
    //             }
    //         });
    //         requests.push(request);
    //     }
    //     return Promise.all(requests);
    // }
    // uploadProjectImage(files) {
    //     let requests = [];
        
    //     for (let x = 0; x < files.length; x++) {
    //         let formData = new FormData();
    //         formData.append("image", files[x]);

    //         let request = http.post('/projectimage/', formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data"
    //             }
    //         });
    //         requests.push(request);
    //     }
    //     return Promise.all(requests);
    // }
}

export default new UploadFilesService();