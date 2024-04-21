import http from "../http-common"

class UploadFilesService {
    upload(files) {
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

    // getFiles() {
    //     return http.get("/files")
    // }
}

export default new UploadFilesService();