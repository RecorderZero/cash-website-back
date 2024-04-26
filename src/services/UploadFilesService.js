import http from "../http-common"

class UploadFilesService {
    uploadNewImage(files) {
        let requests = [];
        
        for (let x = 0; x < files.length; x++) {
            let formData = new FormData();
            formData.append("image", files[x]);

            let request = http.post('/newimage/', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            requests.push(request);
        }
        return Promise.all(requests);
    }
    uploadCarouselImage(files) {
        let requests = [];
        
        for (let x = 0; x < files.length; x++) {
            let formData = new FormData();
            formData.append("image", files[x]);

            let request = http.post('/carouselimage/', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            requests.push(request);
        }
        return Promise.all(requests);
    }
    // uploadProjectImage(files) {
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
}

export default new UploadFilesService();